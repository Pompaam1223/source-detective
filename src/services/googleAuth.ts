import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.readonly'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

// Prompt consent to ensure fresh tokens with full scopes
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline'
});

// Flag to track sign-in state
let isSigningIn = false;

// In-memory token caching
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Listeners for auth state changes
const authSubscribers = new Set<(user: User | null, token: string | null) => void>();

export const notifyAuthSubscribers = () => {
  authSubscribers.forEach(cb => cb(cachedUser, cachedAccessToken));
};

export const subscribeAuth = (cb: (user: User | null, token: string | null) => void) => {
  authSubscribers.add(cb);
  cb(cachedUser, cachedAccessToken);
  return () => {
    authSubscribers.delete(cb);
  };
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      cachedUser = user;
      if (cachedAccessToken) {
        notifyAuthSubscribers();
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might have expired or user refreshed
        notifyAuthSubscribers();
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedUser = null;
      cachedAccessToken = null;
      notifyAuthSubscribers();
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('ไม่สามารถรับ Access Token จาก Google OAuth ได้');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    notifyAuthSubscribers();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCachedUser = (): User | null => {
  return cachedUser;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Sign out error:', e);
  } finally {
    cachedAccessToken = null;
    cachedUser = null;
    notifyAuthSubscribers();
  }
};
