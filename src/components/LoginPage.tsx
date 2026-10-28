import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { type AuthUser, loginUser, registerUser } from '../services/api';
import { BrandLogo } from './BrandLogo';

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser) => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onAuthSuccess,
  onContinueAsGuest,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await registerUser(name, email, password);
        onAuthSuccess(res.user);
      } else {
        const res = await loginUser(email, password);
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col lg:flex-row overflow-y-auto">
      {/* Left Brand & Value Showcase Panel (Visible on lg+ screens) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <BrandLogo size="lg" variant="light" />
          <div>
            <span className="font-bold text-xl tracking-tight text-white block leading-none">
              BuildCV
            </span>
            <span className="text-xs text-indigo-200 font-medium">
              Smart Resume Builder & ATS Optimizer
            </span>
          </div>
        </div>

        {/* Center Value Proposition & Feature Cards */}
        <div className="relative z-10 space-y-6 my-auto py-8">
          <div className="space-y-3 max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Workspace
            </span>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Create ATS-friendly resumes tailored to any job in seconds.
            </h1>
            <p className="text-sm xl:text-base text-indigo-100/90 leading-relaxed">
              Build publication-grade PDF resumes, check your ATS match rate against real job
              descriptions, and automatically tailor your experience with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 max-w-lg pt-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Instant ATS Readiness Score</h3>
                <p className="text-xs text-indigo-100/80 mt-0.5">
                  Verify formatting, action verbs, measurable impact, and keyword alignment before
                  you apply.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">One-Click Job Description Tailoring</h3>
                <p className="text-xs text-indigo-100/80 mt-0.5">
                  Paste any job posting and let BuildCV AI optimize your summary, skills, and bullet
                  points.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  9 Professional Templates & Cloud Sync
                </h3>
                <p className="text-xs text-indigo-100/80 mt-0.5">
                  Switch between Harvard, Classic, Modern, and Engineering layouts with instant PDF
                  export.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200/80 pt-4 border-t border-white/15">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> 100% ATS-Parsable Vector PDFs
          </span>
          <span>© {new Date().getFullYear()} BuildCV</span>
        </div>
      </div>

      {/* Right Authentication Form Column */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile/Tablet Brand Header (visible below lg) */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-2">
            <BrandLogo size="lg" />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">BuildCV</h1>
              <p className="text-xs text-slate-500">Smart Resume Builder & ATS Optimizer</p>
            </div>
          </div>

          {/* Main Login / Register Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-5">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {mode === 'login' ? 'Welcome back' : 'Create your free account'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {mode === 'login'
                  ? 'Sign in to access your saved resumes and AI tailoring tools.'
                  : 'Get started in seconds and keep all your tailored resumes synced.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'login' ? (
                  <LogIn className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Divider + Guest Option */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition cursor-pointer"
              >
                Continue as Guest →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
