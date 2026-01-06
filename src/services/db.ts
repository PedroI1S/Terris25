// IndexedDB para armazenar operações e cronogramas
// Tipos
export interface Operation {
  id: string;
  talhaoId: string;
  talhaoName: string;
  type: 'planting' | 'spraying' | 'irrigation' | 'fertilizing' | 'harvesting';
  date: string;
  culture: string;
  area: number;
  details: {
    seedsPlanted?: number;
    yield?: number;
    product?: string;
    notes?: string;
  };
}

interface CropSchedule {
  culture: string;
  daysToHarvest: number;
  daysToFirstSpraying: number;
  daysToIrrigation: number;
  daysToSecondSpraying?: number;
  sprayingNotes: string;
  irrigationNotes: string;
}

const DB_NAME = 'TerrisDB';
const DB_VERSION = 1;
const OPERATIONS_STORE = 'operations';

// Cronogramas por cultura
export const CROP_SCHEDULES: Record<string, CropSchedule> = {
  'Soja': {
    culture: 'Soja',
    daysToHarvest: 120,
    daysToFirstSpraying: 10,
    daysToIrrigation: 25,
    daysToSecondSpraying: 45,
    sprayingNotes: 'Herbicida pós-emergência',
    irrigationNotes: 'Fase vegetativa V4-V6',
  },
  'Milho': {
    culture: 'Milho',
    daysToHarvest: 140,
    daysToFirstSpraying: 15,
    daysToIrrigation: 30,
    daysToSecondSpraying: 60,
    sprayingNotes: 'Controle de plantas daninhas',
    irrigationNotes: 'Estádio V6-V8',
  },
  'Trigo': {
    culture: 'Trigo',
    daysToHarvest: 130,
    daysToFirstSpraying: 20,
    daysToIrrigation: 40,
    daysToSecondSpraying: 70,
    sprayingNotes: 'Fungicida preventivo',
    irrigationNotes: 'Fase de afilhamento',
  },
};

class TerrisDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create operations store
        if (!db.objectStoreNames.contains(OPERATIONS_STORE)) {
          const operationsStore = db.createObjectStore(OPERATIONS_STORE, { keyPath: 'id' });
          operationsStore.createIndex('talhaoId', 'talhaoId', { unique: false });
          operationsStore.createIndex('date', 'date', { unique: false });
          operationsStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async addOperation(operation: Operation): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OPERATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(OPERATIONS_STORE);
      const request = store.add(operation);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOperationsByTalhao(talhaoId: string): Promise<Operation[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OPERATIONS_STORE], 'readonly');
      const store = transaction.objectStore(OPERATIONS_STORE);
      const index = store.index('talhaoId');
      const request = index.getAll(talhaoId);

      request.onsuccess = () => {
        const operations = request.result;
        // Ordena por data decrescente
        operations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(operations);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getLastPlanting(talhaoId: string): Promise<Operation | null> {
    const operations = await this.getOperationsByTalhao(talhaoId);
    const planting = operations.find(op => op.type === 'planting');
    return planting || null;
  }

  async getAllOperations(): Promise<Operation[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([OPERATIONS_STORE], 'readonly');
      const store = transaction.objectStore(OPERATIONS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const operations = request.result;
        operations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(operations);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Função para popular dados iniciais
  async seedInitialData(): Promise<void> {
    const allOps = await this.getAllOperations();
    if (allOps.length > 0) return; // Já tem dados

    const initialOperations: Operation[] = [
      // Talhão 1 - Soja
      {
        id: 'op-001',
        talhaoId: 'talhao-123',
        talhaoName: 'Talhão 1',
        type: 'planting',
        date: '2024-10-15T08:00:00Z',
        culture: 'Soja',
        area: 85.4,
        details: {
          seedsPlanted: 23912000,
          notes: 'Plantio realizado com sucesso',
        },
      },
      {
        id: 'op-002',
        talhaoId: 'talhao-123',
        talhaoName: 'Talhão 1',
        type: 'fertilizing',
        date: '2024-09-20T10:30:00Z',
        culture: 'Soja',
        area: 85.4,
        details: {
          product: 'NPK 04-14-08',
          notes: 'Adubação de base',
        },
      },
      {
        id: 'op-003',
        talhaoId: 'talhao-123',
        talhaoName: 'Talhão 1',
        type: 'spraying',
        date: '2024-08-10T07:00:00Z',
        culture: 'Soja',
        area: 85.4,
        details: {
          product: 'Glifosato',
          notes: 'Dessecação pré-plantio',
        },
      },
      // Talhão 2 - Milho
      {
        id: 'op-004',
        talhaoId: 'talhao-124',
        talhaoName: 'Talhão 2',
        type: 'planting',
        date: '2024-09-10T08:30:00Z',
        culture: 'Milho',
        area: 42.3,
        details: {
          seedsPlanted: 11844000,
          notes: 'Plantio com espaçamento de 0.5m',
        },
      },
      {
        id: 'op-005',
        talhaoId: 'talhao-124',
        talhaoName: 'Talhão 2',
        type: 'irrigation',
        date: '2024-10-05T06:00:00Z',
        culture: 'Milho',
        area: 42.3,
        details: {
          notes: 'Irrigação fase V6',
        },
      },
      {
        id: 'op-006',
        talhaoId: 'talhao-124',
        talhaoName: 'Talhão 2',
        type: 'fertilizing',
        date: '2024-08-25T09:00:00Z',
        culture: 'Milho',
        area: 42.3,
        details: {
          product: 'Ureia',
          notes: 'Adubação de cobertura',
        },
      },
    ];

    for (const op of initialOperations) {
      await this.addOperation(op);
    }
  }
}

export const db = new TerrisDB();
