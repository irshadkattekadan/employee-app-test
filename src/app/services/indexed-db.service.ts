import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'employeeApp';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('employees')) {
        const store = db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('role', 'role', { unique: false });
        store.createIndex('fromDate', 'fromDate', { unique: false });
        store.createIndex('toDate', 'toDate', { unique: false });
      }
    };

    request.onsuccess = () => {
      this.db = request.result;
    };

    request.onerror = () => {
      console.error('IndexedDB init error:', request.error);
    };
  }

  getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialized');
      }

      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialized');
      }

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.add(data);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  update<T extends { id: number }>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(data);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  delete(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  addWithId<T>(storeName: string, data: T & { id: number }): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(data); // put() with id overwrites/adds by id
  
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  getByKey<T>(storeName: string, id: number): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
  
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
  
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  }
}
