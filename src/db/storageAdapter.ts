import {
  ClientProfile,
  CalendarDayRow,
  ProjectRecord,
  BatchProgressRecord,
  BackupDataPayload,
  ProfileVersionRecord,
} from '../types';
import { PRESET_PROFILES } from '../data/presetProfiles';
import { buildFull365CalendarRows } from '../data/calendarEngine';

export interface IStorageAdapter {
  init(): Promise<void>;
  getProjects(): Promise<ProjectRecord[]>;
  getProject(id: string): Promise<ProjectRecord | null>;
  saveProject(project: ProjectRecord): Promise<void>;
  deleteProject(id: string): Promise<void>;
  
  getClients(): Promise<(ClientProfile & { id: string })[]>;
  saveClient(client: ClientProfile & { id: string }): Promise<void>;
  deleteClient(id: string): Promise<void>;

  getCalendar(projectId: string): Promise<CalendarDayRow[] | null>;
  saveCalendar(projectId: string, rows: CalendarDayRow[]): Promise<void>;
  updateDay(projectId: string, day: CalendarDayRow): Promise<void>;

  getBatchProgress(projectId: string): Promise<BatchProgressRecord | null>;
  saveBatchProgress(progress: BatchProgressRecord): Promise<void>;

  getActiveProjectId(): Promise<string | null>;
  setActiveProjectId(id: string): Promise<void>;

  getProfileVersions(projectId: string): Promise<ProfileVersionRecord[]>;
  saveProfileVersion(version: ProfileVersionRecord): Promise<void>;
  deleteProfileVersion(id: string): Promise<void>;

  exportBackup(): Promise<BackupDataPayload>;
  importBackup(
    payload: BackupDataPayload,
    mode?: 'merge' | 'overwrite'
  ): Promise<{ importedProjects: number; importedClients: number }>;
}

const DB_NAME = 'Egyptian365SocialMediaDB';
const DB_VERSION = 2;

/**
 * Robust IndexedDB Storage Implementation for Browser
 */
export class IndexedDbStorageAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB is not available in current environment, using memory mock');
        resolve();
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Projects Store
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }

        // Clients Store
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'id' });
        }

        // Calendars Store (holds 365 rows per project)
        if (!db.objectStoreNames.contains('calendars')) {
          db.createObjectStore('calendars', { keyPath: 'projectId' });
        }

        // Batch Progress Store
        if (!db.objectStoreNames.contains('batch_progress')) {
          db.createObjectStore('batch_progress', { keyPath: 'projectId' });
        }

        // Meta Store (activeProjectId, preferences)
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }

        // Profile Versions Store
        if (!db.objectStoreNames.contains('profile_versions')) {
          const vStore = db.createObjectStore('profile_versions', { keyPath: 'id' });
          vStore.createIndex('projectId', 'projectId', { unique: false });
        }
      };

      request.onsuccess = async () => {
        this.db = request.result;
        try {
          await this.ensureInitialSeed();
        } catch (e) {
          console.warn('Initial seed check error:', e);
        }
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
    });

    return this.initPromise;
  }

  private async ensureInitialSeed(): Promise<void> {
    const projects = await this.getProjects();
    if (projects.length === 0) {
      // Seed default project from initial preset
      const defaultClient = PRESET_PROFILES[0].profile;
      const defaultProjectId = 'proj_default_dental_2026';
      const initialProject: ProjectRecord = {
        id: defaultProjectId,
        name: `مشروع ${defaultClient.companyName}`,
        clientProfile: defaultClient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        year: 2026,
        totalDays: 365,
        generatedDaysCount: 365,
        completedMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        status: 'completed',
      };

      await this.saveProject(initialProject);
      await this.saveClient({ ...defaultClient, id: 'client_dental_default' });
      
      const initialRows = buildFull365CalendarRows(defaultClient, {}, 2026);
      await this.saveCalendar(defaultProjectId, initialRows);

      await this.saveBatchProgress({
        projectId: defaultProjectId,
        currentMonth: 12,
        completedMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lastCompletedDay: 365,
        isGenerating: false,
        isPaused: false,
        lastUpdated: new Date().toISOString(),
      });

      await this.setActiveProjectId(defaultProjectId);
    }
  }

  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('IndexedDB has not been initialized');
    }
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  async getProjects(): Promise<ProjectRecord[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('projects', 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getProject(id: string): Promise<ProjectRecord | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('projects', 'readonly');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async saveProject(project: ProjectRecord): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('projects', 'readwrite');
        const updated = {
          ...project,
          updatedAt: new Date().toISOString(),
        };
        const request = store.put(updated);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        // Delete project, its calendar, and its batch progress
        const tx = this.db!.transaction(['projects', 'calendars', 'batch_progress'], 'readwrite');
        tx.objectStore('projects').delete(id);
        tx.objectStore('calendars').delete(id);
        tx.objectStore('batch_progress').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getClients(): Promise<(ClientProfile & { id: string })[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('clients', 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async saveClient(client: ClientProfile & { id: string }): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('clients', 'readwrite');
        const request = store.put(client);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteClient(id: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('clients', 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getCalendar(projectId: string): Promise<CalendarDayRow[] | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('calendars', 'readonly');
        const request = store.get(projectId);
        request.onsuccess = () => {
          if (request.result && Array.isArray(request.result.rows)) {
            resolve(request.result.rows);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async saveCalendar(projectId: string, rows: CalendarDayRow[]): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('calendars', 'readwrite');
        const request = store.put({
          projectId,
          rows,
          updatedAt: new Date().toISOString(),
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateDay(projectId: string, day: CalendarDayRow): Promise<void> {
    await this.init();
    const rows = await this.getCalendar(projectId);
    if (!rows) return;

    const index = rows.findIndex((r) => r.dayNumber === day.dayNumber);
    if (index !== -1) {
      rows[index] = { ...rows[index], ...day };
      await this.saveCalendar(projectId, rows);
    }
  }

  async getBatchProgress(projectId: string): Promise<BatchProgressRecord | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('batch_progress', 'readonly');
        const request = store.get(projectId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async saveBatchProgress(progress: BatchProgressRecord): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('batch_progress', 'readwrite');
        const request = store.put(progress);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getActiveProjectId(): Promise<string | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const store = this.getStore('meta', 'readonly');
        const request = store.get('activeProjectId');
        request.onsuccess = () => resolve(request.result ? request.result.value : null);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async setActiveProjectId(id: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('meta', 'readwrite');
        const request = store.put({ key: 'activeProjectId', value: id });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getProfileVersions(projectId: string): Promise<ProfileVersionRecord[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        if (!this.db!.objectStoreNames.contains('profile_versions')) {
          resolve([]);
          return;
        }
        const tx = this.db!.transaction('profile_versions', 'readonly');
        const store = tx.objectStore('profile_versions');
        const index = store.index('projectId');
        const req = index.getAll(projectId);
        req.onsuccess = () => {
          const list: ProfileVersionRecord[] = req.result || [];
          list.sort((a, b) => b.versionNumber - a.versionNumber);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  async saveProfileVersion(version: ProfileVersionRecord): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        if (!this.db!.objectStoreNames.contains('profile_versions')) {
          resolve();
          return;
        }
        const tx = this.db!.transaction('profile_versions', 'readwrite');
        const store = tx.objectStore('profile_versions');
        const req = store.put(version);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteProfileVersion(id: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        if (!this.db!.objectStoreNames.contains('profile_versions')) {
          resolve();
          return;
        }
        const tx = this.db!.transaction('profile_versions', 'readwrite');
        const store = tx.objectStore('profile_versions');
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async exportBackup(): Promise<BackupDataPayload> {
    await this.init();
    const projects = await this.getProjects();
    const clients = await this.getClients();
    const activeProjectId = (await this.getActiveProjectId()) || undefined;

    const calendars: Record<string, CalendarDayRow[]> = {};
    const batchProgress: Record<string, BatchProgressRecord> = {};

    for (const proj of projects) {
      const cal = await this.getCalendar(proj.id);
      if (cal) {
        calendars[proj.id] = cal;
      }
      const prog = await this.getBatchProgress(proj.id);
      if (prog) {
        batchProgress[proj.id] = prog;
      }
    }

    return {
      version: '1.0.0',
      appName: 'نظام إدارة وإنتاج 365 بوست سوشيال ميديا',
      exportDate: new Date().toISOString(),
      activeProjectId,
      projects,
      clients,
      calendars,
      batchProgress,
    };
  }

  async importBackup(
    payload: BackupDataPayload,
    mode: 'merge' | 'overwrite' = 'merge'
  ): Promise<{ importedProjects: number; importedClients: number }> {
    await this.init();
    if (!this.db) return { importedProjects: 0, importedClients: 0 };

    if (mode === 'overwrite') {
      const existingProjects = await this.getProjects();
      for (const p of existingProjects) {
        await this.deleteProject(p.id);
      }
    }

    let pCount = 0;
    let cCount = 0;

    // Save clients
    if (Array.isArray(payload.clients)) {
      for (const client of payload.clients) {
        const id = client.id || `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await this.saveClient({ ...client, id });
        cCount++;
      }
    }

    // Save projects and their calendars
    if (Array.isArray(payload.projects)) {
      for (const proj of payload.projects) {
        await this.saveProject(proj);
        pCount++;

        if (payload.calendars && payload.calendars[proj.id]) {
          await this.saveCalendar(proj.id, payload.calendars[proj.id]);
        }

        if (payload.batchProgress && payload.batchProgress[proj.id]) {
          await this.saveBatchProgress(payload.batchProgress[proj.id]);
        }
      }
    }

    if (payload.activeProjectId) {
      await this.setActiveProjectId(payload.activeProjectId);
    } else if (payload.projects.length > 0) {
      await this.setActiveProjectId(payload.projects[0].id);
    }

    return { importedProjects: pCount, importedClients: cCount };
  }
}

/**
 * PostgreSQL Storage Adapter Stub
 * Designed for immediate drop-in replacement when connecting to PostgreSQL or Cloud SQL in future phase.
 */
export class PostgresStorageAdapter implements IStorageAdapter {
  constructor(private apiBaseUrl: string = '/api/db') {}

  async init(): Promise<void> {
    console.info('PostgresStorageAdapter configured for API endpoint:', this.apiBaseUrl);
  }

  async getProjects(): Promise<ProjectRecord[]> {
    const res = await fetch(`${this.apiBaseUrl}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects from PostgreSQL');
    return res.json();
  }

  async getProject(id: string): Promise<ProjectRecord | null> {
    const res = await fetch(`${this.apiBaseUrl}/projects/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async saveProject(project: ProjectRecord): Promise<void> {
    await fetch(`${this.apiBaseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await fetch(`${this.apiBaseUrl}/projects/${id}`, { method: 'DELETE' });
  }

  async getClients(): Promise<(ClientProfile & { id: string })[]> {
    const res = await fetch(`${this.apiBaseUrl}/clients`);
    return res.json();
  }

  async saveClient(client: ClientProfile & { id: string }): Promise<void> {
    await fetch(`${this.apiBaseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: string): Promise<void> {
    await fetch(`${this.apiBaseUrl}/clients/${id}`, { method: 'DELETE' });
  }

  async getCalendar(projectId: string): Promise<CalendarDayRow[] | null> {
    const res = await fetch(`${this.apiBaseUrl}/calendars/${projectId}`);
    if (!res.ok) return null;
    return res.json();
  }

  async saveCalendar(projectId: string, rows: CalendarDayRow[]): Promise<void> {
    await fetch(`${this.apiBaseUrl}/calendars/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    });
  }

  async updateDay(projectId: string, day: CalendarDayRow): Promise<void> {
    await fetch(`${this.apiBaseUrl}/calendars/${projectId}/days/${day.dayNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(day),
    });
  }

  async getBatchProgress(projectId: string): Promise<BatchProgressRecord | null> {
    const res = await fetch(`${this.apiBaseUrl}/batch-progress/${projectId}`);
    if (!res.ok) return null;
    return res.json();
  }

  async saveBatchProgress(progress: BatchProgressRecord): Promise<void> {
    await fetch(`${this.apiBaseUrl}/batch-progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    });
  }

  async getActiveProjectId(): Promise<string | null> {
    const res = await fetch(`${this.apiBaseUrl}/meta/active-project`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.activeProjectId || null;
  }

  async setActiveProjectId(id: string): Promise<void> {
    await fetch(`${this.apiBaseUrl}/meta/active-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeProjectId: id }),
    });
  }

  async getProfileVersions(projectId: string): Promise<ProfileVersionRecord[]> {
    const res = await fetch(`${this.apiBaseUrl}/profile-versions/${projectId}`);
    if (!res.ok) return [];
    return res.json();
  }

  async saveProfileVersion(version: ProfileVersionRecord): Promise<void> {
    await fetch(`${this.apiBaseUrl}/profile-versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(version),
    });
  }

  async deleteProfileVersion(id: string): Promise<void> {
    await fetch(`${this.apiBaseUrl}/profile-versions/${id}`, { method: 'DELETE' });
  }

  async exportBackup(): Promise<BackupDataPayload> {
    const res = await fetch(`${this.apiBaseUrl}/backup/export`);
    return res.json();
  }

  async importBackup(payload: BackupDataPayload): Promise<{ importedProjects: number; importedClients: number }> {
    const res = await fetch(`${this.apiBaseUrl}/backup/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
}

// Singleton storage instance
let storageInstance: IStorageAdapter | null = null;

export function getStorage(): IStorageAdapter {
  if (!storageInstance) {
    storageInstance = new IndexedDbStorageAdapter();
  }
  return storageInstance;
}
