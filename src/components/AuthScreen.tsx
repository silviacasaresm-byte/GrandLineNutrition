import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Database,
  KeyRound,
  Compass,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, enterAsGuest } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsOperationNotAllowed(false);

    if (!email || !password) {
      setErrorMessage('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password, displayName || 'Tripulante');
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      const errCode = err.code || '';
      const errMsg = err.message || '';

      if (errCode === 'auth/operation-not-allowed' || errMsg.includes('operation-not-allowed')) {
        setIsOperationNotAllowed(true);
        setErrorMessage(
          'El proveedor de Correo/Contraseña no está habilitado por defecto en la consola de Firebase. Te recomendamos iniciar sesión con Google (1 clic) o entrar en Modo Local.'
        );
      } else if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
        setErrorMessage('Correo electrónico o contraseña incorrectos.');
      } else if (errCode === 'auth/email-already-in-use') {
        setErrorMessage('Este correo ya está registrado. Por favor, inicia sesión.');
      } else if (errCode === 'auth/invalid-email') {
        setErrorMessage('El formato del correo electrónico no es válido.');
      } else {
        setErrorMessage(errMsg || 'Ocurrió un error al procesar el acceso.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setIsOperationNotAllowed(false);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Error Google Auth:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Se canceló la ventana de inicio de sesión de Google.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMessage('Google Sign-In debe estar habilitado en la consola de Firebase.');
      } else {
        setErrorMessage(err.message || 'No se pudo completar el acceso con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#084C61] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Container Box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#FDDF28]/40 overflow-hidden">
        {/* Top Pirate Banner */}
        <div className="bg-[#084C61] text-white p-6 text-center relative border-b-4 border-[#FDDF28]">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#DC0F0D] flex items-center justify-center text-white border-4 border-[#FDDF28] shadow-lg mb-3">
            <span className="text-3xl font-black">☠</span>
          </div>
          <h1 className="text-xl font-black uppercase text-[#FDDF28] tracking-widest leading-tight">
            Grand Line Diet System
          </h1>
          <p className="text-xs text-sky-200 mt-1 font-medium">
            Gestión Nutricional de la Tripulación de Sombrero de Paja
          </p>

          <div className="mt-3 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-black/40 text-[11px] text-amber-300 border border-yellow-400/30">
            <Database className="w-3 h-3 text-yellow-300" />
            <span>Base de Datos Firestore Activa</span>
          </div>
        </div>

        {/* Acceso Principal Recomendado (Google 1-Clic) */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border-2 border-slate-300 hover:border-[#0284C7] shadow-sm flex items-center justify-center space-x-3 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Acceder con Cuenta de Google (1 Clic)</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Método instantáneo y recomendado para sincronizar con Firestore
            </p>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              O con Correo y Contraseña
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Mensaje de Error / Solución */}
          {errorMessage && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-900">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>

              {isOperationNotAllowed && (
                <div className="pt-2 border-t border-amber-200 text-[11px] space-y-1.5">
                  <p className="font-bold text-amber-950">Alternativas inmediatas:</p>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-1.5 bg-[#0284C7] hover:bg-[#084C61] text-white rounded font-bold text-center"
                    >
                      Usar Acceso con Google
                    </button>
                    <button
                      type="button"
                      onClick={enterAsGuest}
                      className="w-full py-1.5 bg-white border border-amber-400 hover:bg-amber-100 text-amber-950 rounded font-bold text-center"
                    >
                      Continuar en Modo Local / Sin Registro
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selector de Pestaña: Iniciar Sesión / Registrarse */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
                setIsOperationNotAllowed(false);
              }}
              className={`flex-1 py-2 text-center transition-all ${
                !isRegister
                  ? 'text-[#084C61] border-b-2 border-[#DC0F0D] font-black'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
                setIsOperationNotAllowed(false);
              }}
              className={`flex-1 py-2 text-center transition-all ${
                isRegister
                  ? 'text-[#084C61] border-b-2 border-[#DC0F0D] font-black'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Formulario de Email/Contraseña */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre de Usuario / Pirata
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Monkey D. Luffy"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284C7] font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284C7] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284C7] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#DC0F0D] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Conectando...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Registrar y Guardar Dieta' : 'Iniciar Sesión con Correo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Acceso en Modo Local / Invitado */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={enterAsGuest}
              className="text-xs text-slate-500 hover:text-[#084C61] font-semibold underline"
            >
              Continuar en Modo Local / Sin Cuenta →
            </button>
          </div>
        </div>

        {/* Pie de Seguridad */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Base de datos Firestore con Reglas de Seguridad de Propiedad</span>
        </div>
      </div>
    </div>
  );
};
