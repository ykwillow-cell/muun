/**
 * IndexedDB를 활용한 타로 상담 기록 관리 유틸리티
 * 브라우저 로컬 스토리지에 상담 기록을 저장하고 조회합니다.
 */

export interface TarotCard {
  id: number;
  name: string;
  korName: string;
  image: string;
}

export interface TarotReading {
  id?: number;
  timestamp: number;
  question: string;
  selectedCards: TarotCard[];
  interpretation: string;
}

const DB_NAME = "MuunTarotDB";
const DB_VERSION = 1;
const STORE_NAME = "readings";

/**
 * IndexedDB 초기화 및 데이터베이스 열기
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB 열기 실패:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 기존 스토어 삭제 후 재생성
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      // 새로운 오브젝트 스토어 생성 (keyPath: id, autoIncrement: true)
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });

      // 타임스탬프 인덱스 생성 (최신순 정렬을 위해)
      store.createIndex("timestamp", "timestamp", { unique: false });
    };
  });
}

/**
 * 타로 상담 기록 저장
 */
export async function saveTarotReading(
  reading: Omit<TarotReading, "id">
): Promise<number> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add(reading);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log("타로 기록 저장 성공:", request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error("타로 기록 저장 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 저장 중 오류:", error);
    throw error;
  }
}

/**
 * 모든 타로 상담 기록 조회 (최신순 정렬)
 */
export async function getAllTarotReadings(): Promise<TarotReading[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    // 역순(최신순)으로 정렬하기 위해 openCursor 사용
    const request = index.openCursor(null, "prev");
    const readings: TarotReading[] = [];

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          readings.push(cursor.value as TarotReading);
          cursor.continue();
        } else {
          resolve(readings);
        }
      };

      request.onerror = () => {
        console.error("타로 기록 조회 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 조회 중 오류:", error);
    throw error;
  }
}

/**
 * 특정 ID의 타로 상담 기록 조회
 */
export async function getTarotReadingById(id: number): Promise<TarotReading | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result as TarotReading | undefined || null);
      };

      request.onerror = () => {
        console.error("타로 기록 조회 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 조회 중 오류:", error);
    throw error;
  }
}

/**
 * 타로 상담 기록 삭제
 */
export async function deleteTarotReading(id: number): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log("타로 기록 삭제 성공:", id);
        resolve();
      };

      request.onerror = () => {
        console.error("타로 기록 삭제 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 삭제 중 오류:", error);
    throw error;
  }
}

/**
 * 모든 타로 상담 기록 삭제 (초기화)
 */
export async function clearAllTarotReadings(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log("모든 타로 기록 삭제 완료");
        resolve();
      };

      request.onerror = () => {
        console.error("타로 기록 초기화 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 초기화 중 오류:", error);
    throw error;
  }
}

/**
 * 타로 기록 개수 조회
 */
export async function getTarotReadingsCount(): Promise<number> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("타로 기록 개수 조회 실패:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB 개수 조회 중 오류:", error);
    throw error;
  }
}
