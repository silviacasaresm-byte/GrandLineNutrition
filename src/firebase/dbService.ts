import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { FortnightDiet, BioimpedanceRecord } from '../types';
import { INITIAL_FORTNIGHT_DIET } from '../data/initialDiet';
import { INITIAL_BIOIMPEDANCE_RECORDS } from '../data/initialBioimpedance';

export interface UserProfileData {
  userId: string;
  email: string;
  displayName: string;
  targetCalories: number;
  updatedAt?: any;
}

// 1. Guardar y Obtener Perfil de Usuario
export async function saveUserProfile(userId: string, email: string, displayName: string = 'Capitán Pirata') {
  const userPath = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      userId,
      email,
      displayName,
      targetCalories: 2450,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// 2. Dieta Quincenal
export async function saveUserDiet(userId: string, diet: FortnightDiet) {
  const dietPath = `users/${userId}/diet/fortnight`;
  try {
    const dietRef = doc(db, 'users', userId, 'diet', 'fortnight');
    await setDoc(dietRef, {
      ...diet,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, dietPath);
  }
}

export function subscribeUserDiet(
  userId: string, 
  onData: (diet: FortnightDiet) => void,
  onError?: (err: any) => void
) {
  const dietPath = `users/${userId}/diet/fortnight`;
  const dietRef = doc(db, 'users', userId, 'diet', 'fortnight');

  return onSnapshot(
    dietRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as FortnightDiet;
        onData(data);
      } else {
        // Inicializar con la dieta por defecto
        try {
          await saveUserDiet(userId, INITIAL_FORTNIGHT_DIET);
          onData(INITIAL_FORTNIGHT_DIET);
        } catch (e) {
          console.error('Error al inicializar dieta:', e);
        }
      }
    },
    (error) => {
      console.error('Error en suscripción de dieta:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, dietPath);
    }
  );
}

// 3. Registros de Bioimpedancia
export async function saveUserBioRecord(userId: string, record: BioimpedanceRecord) {
  const bioPath = `users/${userId}/bioimpedance/${record.id}`;
  try {
    const recordRef = doc(db, 'users', userId, 'bioimpedance', record.id);
    await setDoc(recordRef, {
      ...record,
      userId,
      createdAt: record.date
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, bioPath);
  }
}

export async function deleteUserBioRecord(userId: string, recordId: string) {
  const bioPath = `users/${userId}/bioimpedance/${recordId}`;
  try {
    const recordRef = doc(db, 'users', userId, 'bioimpedance', recordId);
    await deleteDoc(recordRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, bioPath);
  }
}

export function subscribeUserBioRecords(
  userId: string,
  onData: (records: BioimpedanceRecord[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = `users/${userId}/bioimpedance`;
  const colRef = collection(db, 'users', userId, 'bioimpedance');

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: BioimpedanceRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BioimpedanceRecord);
        });
        // Ordenar por fecha cronológica ascendente
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        onData(list);
      } else {
        // Inicializar con los registros iniciales si está vacío
        try {
          for (const initRec of INITIAL_BIOIMPEDANCE_RECORDS) {
            await saveUserBioRecord(userId, initRec);
          }
          onData(INITIAL_BIOIMPEDANCE_RECORDS);
        } catch (e) {
          console.error('Error al inicializar bioimpedancia:', e);
        }
      }
    },
    (error) => {
      console.error('Error en suscripción de bioimpedancia:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  );
}
