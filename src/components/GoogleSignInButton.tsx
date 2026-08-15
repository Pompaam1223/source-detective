import React, { useState, useEffect } from 'react';
import { googleSignIn, logout, subscribeAuth, getCachedUser } from '../services/googleAuth';
import { User } from 'firebase/auth';
import { LogIn, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onAuthChange?: (user: User | null, token: string | null) => void;
  className?: string;
  showUserInfo?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onAuthChange,
  className = '',
  showUserInfo = true
}) => {
  const [user, setUser] = useState<User | null>(getCachedUser());
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAuth((u, t) => {
      setUser(u);
      setToken(t);
      if (onAuthChange) onAuthChange(u, t);
    });
    return () => unsubscribe();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        if (onAuthChange) onAuthChange(res.user, res.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'เกิดข้อผิดพลาดในการลงชื่อเข้าใช้ Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      if (onAuthChange) onAuthChange(null, null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user && token) {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {showUserInfo && (
          <div className="flex items-center space-x-2.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-2xl text-xs">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-emerald-400"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="text-left leading-tight">
              <p className="font-bold text-emerald-950 dark:text-emerald-300 truncate max-w-[150px]">
                {user.displayName || user.email}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> เชื่อมต่อ Google Sheets แล้ว
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-300 dark:border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="cursor-pointer inline-flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        )}
        <span>{isLoading ? 'กำลังเชื่อมต่อ Google...' : 'ลงชื่อเข้าใช้ด้วย Google (Sign in with Google)'}</span>
      </button>

      {error && (
        <div className="mt-2 text-xs text-rose-500 dark:text-rose-400 flex items-center space-x-1 font-bold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
