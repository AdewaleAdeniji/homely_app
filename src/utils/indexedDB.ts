const dbName = "homely-app";

export const dbStores = {
    charges: "charges",
    tasks: "tasks",
} as const;

type DBStore = typeof dbStores[keyof typeof dbStores];
type DB = IDBDatabase;

function openDatabase(dbStore: DBStore): Promise<DB> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(dbStore)) {
                db.createObjectStore(dbStore, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
}

async function itemExists(id: string, dbStore: DBStore): Promise<boolean> {
    const db = await openDatabase(dbStore);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbStore, "readonly");
        const store = transaction.objectStore(dbStore);
        const request = store.get(id);

        request.onsuccess = (event) => {
            resolve(!!(event.target as IDBRequest).result);
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveItem<T extends { id: any }>(item: T, dbStore: DBStore): Promise<void> {
    const db = await openDatabase(dbStore);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbStore, "readwrite");
        const store = transaction.objectStore(dbStore);
        const request = store.put(item);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

async function getItem<T>(id: string, dbStore: DBStore): Promise<T | null> {
    const db = await openDatabase(dbStore);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbStore, "readonly");
        const store = transaction.objectStore(dbStore);
        const request = store.get(id);

        request.onsuccess = async (event) => {
            const item = (event.target as IDBRequest).result as T & { expiry?: number } | undefined;
            if (item) {
                const now = Date.now();
                if (item.expiry && now > item.expiry) {
                    await deleteItem(id, dbStore);
                    resolve(null);
                } else {
                    resolve(item);
                }
            } else {
                resolve(null);
            }
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}
async function getAllItems<T>(dbStore: DBStore): Promise<T[]> {
    const db = await openDatabase(dbStore);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbStore, "readonly");
        const store = transaction.objectStore(dbStore);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result as T[]);
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

async function deleteItem(id: string, dbStore: DBStore): Promise<void> {
    const db = await openDatabase(dbStore);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(dbStore, "readwrite");
        const store = transaction.objectStore(dbStore);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

const indexDBService = {
    itemExists,
    saveItem,
    getItem,
    deleteItem,
    getAllItems
};
export default indexDBService;
