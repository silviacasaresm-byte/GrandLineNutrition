import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { saveUserProfile } from '../firebase/dbService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  enterAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsGuest(false);
        // Asegurar que el perfil existe en Firestore
        await saveUserProfile(
          firebaseUser.uid,
          firebaseUser.email || '',
          firebaseUser.displayName || 'Capitán Pirata'
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      setIsGuest(false);
      await saveUserProfile(cred.user.uid, cred.user.email || email, cred.user.displayName || 'Capitán Pirata');
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      setIsGuest(false);
      await saveUserProfile(cred.user.uid, email, name || 'Capitán Pirata');
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      setIsGuest(false);
      await saveUserProfile(
        cred.user.uid, 
        cred.user.email || '', 
        cred.user.displayName || 'Capitán Pirata'
      );
    }
  };

  const enterAsGuest = () => {
    setIsGuest(true);
  };

  const logout = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        enterAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
