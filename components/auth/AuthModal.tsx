"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { t, Language } from "@/lib/translations";
import {
  authenticateUser,
  registerUser,
  createDemoSession,
  getSavedSession,
  UserRole,
} from "@/lib/auth";

interface AuthModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function AuthModal({ forceOpen, onClose }: AuthModalProps) {
  const { language, authSession, setAuthSession, isAuthModalOpen, setIsAuthModalOpen } =
    useAppStore();

  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("citizen");

  // On mount, check if there is an existing session
  useEffect(() => {
    const existing = getSavedSession();
    if (existing) {
      setAuthSession(existing);
    }
  }, [setAuthSession]);

  const isOpen = forceOpen !== undefined ? forceOpen : (!authSession || isAuthModalOpen);

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => {
      const demo = createDemoSession();
      setAuthSession(demo);
      setIsAuthModalOpen(false);
      setLoading(false);
      if (onClose) onClose();
    }, 250);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await authenticateUser(identifier, password);
    setLoading(false);

    if (res.success && res.session) {
      setAuthSession(res.session);
      setIsAuthModalOpen(false);
      if (onClose) onClose();
    } else {
      setErrorMsg(res.error || t("invalidCredentials", language));
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(t("passwordsDoNotMatch", language));
      return;
    }

    setLoading(true);
    const res = await registerUser({
      fullName,
      email: regEmail,
      username: regUsername,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      role: regRole,
    });
    setLoading(false);

    if (res.success && res.session) {
      setSuccessMsg(t("signUpSuccess", language));
      setAuthSession(res.session);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (onClose) onClose();
      }, 600);
    } else {
      setErrorMsg(
        res.error ||
          (language === "bn"
            ? "নিবন্ধন সম্পন্ন করা যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন।"
            : "Registration failed. Please check the provided information.")
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-xl md:backdrop-blur-2xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-accent/20 via-surface-alt to-surface px-6 pt-6 pb-4 border-b border-border flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-accent text-accent-ink font-display font-black text-xs flex items-center justify-center shadow-xs">
                BD
              </span>
              <h2 className="font-display font-bold text-xl text-ink">
                {t("appName", language)}
              </h2>
              <span className="px-2 py-0.5 rounded-pill bg-accent-soft text-accent-deep text-[10px] font-bold">
                v0.1
              </span>
            </div>
            <p className="text-xs text-muted leading-tight">
              {t("appTagline", language)}
            </p>
          </div>

          {/* Close button only visible if user already has an active session */}
          {authSession && (
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                if (onClose) onClose();
              }}
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-alt transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* PROMINENT DEMO ACCESS BUTTON BANNER */}
        <div className="px-6 py-3.5 bg-accent/15 border-b border-accent/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-accent-deep shrink-0" />
            <div>
              <div className="text-xs font-bold text-ink">
                {language === "bn" ? "তাৎক্ষণিক মূল্যায়ন ও ডেমো অ্যাক্সেস" : "Instant Evaluation & Demo Access"}
              </div>
              <div className="text-[11px] text-secondary">
                {t("demoAccessSubtitle", language)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            className="btn-lime px-4 py-2 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{t("demoAccessButton", language)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Tabs: Login / Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-alt border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                tab === "login"
                  ? "bg-surface text-ink shadow-xs font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              {t("login", language)}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                tab === "signup"
                  ? "bg-surface text-ink shadow-xs font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              {t("signUp", language)}
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-loss-soft border border-loss/20 text-loss text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-gain-soft border border-gain/20 text-gain text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  {t("emailOrUsername", language)}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="surveyor বা surveyor@bhumidorpon.gov.bd"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink">
                    {t("password", language)}
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-[11px] text-accent-deep hover:underline"
                  >
                    {t("forgotPassword", language)}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-ink text-surface hover:bg-ink/90 font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? (language === "bn" ? "যাচাই হচ্ছে..." : "Verifying...") : t("login", language)}</span>
                </button>
              </div>

              {/* Quick test credentials note */}
              <div className="p-3 rounded-lg bg-surface-alt border border-border text-[11px] text-muted space-y-1">
                <div className="font-semibold text-secondary flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "পরীক্ষামূলক অ্যাকাউন্ট:" : "Test Accounts:"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span>
                    • {language === "bn" ? "সার্ভেয়ার" : "Surveyor"}: <code className="bg-surface px-1 py-0.5 rounded text-ink">surveyor</code> / <code className="bg-surface px-1 py-0.5 rounded text-ink">password123</code>
                  </span>
                  <span>
                    • {language === "bn" ? "নাগরিক" : "Citizen"}: <code className="bg-surface px-1 py-0.5 rounded text-ink">citizen</code> / <code className="bg-surface px-1 py-0.5 rounded text-ink">citizen123</code>
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {tab === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  {t("fullName", language)} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === "bn" ? "যেমন: মো: আরিফুল ইসলাম" : "e.g., Md. Ariful Islam"}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    {t("emailOrUsername", language)} (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    {language === "bn" ? "ব্যবহারকারীর নাম *" : "Username *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ariful_islam"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  {t("userRole", language)}
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                >
                  <option value="citizen">{t("roleCitizen", language)}</option>
                  <option value="surveyor">{t("roleSurveyor", language)}</option>
                  <option value="researcher">{t("roleResearcher", language)}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    {t("password", language)} *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={language === "bn" ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    {t("confirmPassword", language)} *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder={language === "bn" ? "পুনরায় লিখুন" : "Re-enter password"}
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-accent text-accent-ink hover:brightness-105 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? (language === "bn" ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating account...") : t("createNewAccount", language)}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === "forgot" && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-surface-alt border border-border space-y-2">
                <h3 className="font-semibold text-sm text-ink">
                  {t("passwordRecoveryTitle", language)}
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  {t("passwordRecoveryNotice", language)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTab("login")}
                className="w-full py-2.5 rounded-xl bg-surface-alt hover:bg-surface border border-border text-xs sm:text-sm font-semibold text-ink transition-colors"
              >
                ← {t("alreadyHaveAccount", language)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
