/**
 * BhumiDorpon Client-Side Authentication & Session Management
 * Provides user login, registration, password validation, and unprivileged Demo access.
 * Persists session state to localStorage without storing plaintext passwords.
 */

export type UserRole = "citizen" | "surveyor" | "researcher" | "demo";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  isDemo: boolean;
  createdAt: string;
  district?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

const STORAGE_KEY = "bhumidorpon_auth_session";
const REGISTERED_USERS_KEY = "bhumidorpon_registered_users";

// Default demo account
export const DEMO_USER: AuthUser = {
  id: "demo_user_001",
  email: "demo@bhumidorpon.gov.bd",
  username: "demo_visitor",
  fullName: "ডেমো পরিদর্শক (Demo Explorer)",
  role: "demo",
  isDemo: true,
  createdAt: new Date().toISOString(),
};

/**
 * Retrieve saved session from localStorage (if valid)
 */
export function getSavedSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch (e) {
    console.error("Failed to read auth session:", e);
    return null;
  }
}

/**
 * Save session to localStorage
 */
export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Failed to save auth session:", e);
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear auth session:", e);
  }
}

/**
 * Create a Demo Session (Bypasses login, grants unprivileged read-only demo access)
 */
export function createDemoSession(): AuthSession {
  const session: AuthSession = {
    user: DEMO_USER,
    token: `demo_token_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };
  saveSession(session);
  return session;
}

// Default seed accounts for testing and evaluation
const SEED_USERS: Array<{ user: AuthUser; passwordHash: string }> = [
  {
    user: {
      id: "user_officer_01",
      email: "surveyor@bhumidorpon.gov.bd",
      username: "surveyor",
      fullName: "মো: আরিফুল ইসলাম (সার্ভেয়ার)",
      role: "surveyor" as UserRole,
      isDemo: false,
      createdAt: "2024-01-15T00:00:00.000Z",
      district: "sirajganj",
    },
    passwordHash: "password123",
  },
  {
    user: {
      id: "user_citizen_01",
      email: "citizen@bhumidorpon.gov.bd",
      username: "citizen",
      fullName: "রহিম চৌধুরী (জমির মালিক)",
      role: "citizen" as UserRole,
      isDemo: false,
      createdAt: "2024-03-20T00:00:00.000Z",
      district: "sirajganj",
    },
    passwordHash: "citizen123",
  },
];

let nodeMemoryUsers: Array<{ user: AuthUser; passwordHash: string }> = [...SEED_USERS];

/**
 * Helper to get mock registered users
 */
function getRegisteredUsers(): Array<{ user: AuthUser; passwordHash: string }> {
  if (typeof window === "undefined") {
    return nodeMemoryUsers;
  }
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
}


/**
 * Authenticate existing user with email/username and password
 */
export async function authenticateUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: "ইমেইল/ব্যবহারকারীর নাম ও পাসওয়ার্ড প্রদান করুন।" };
  }

  const users = getRegisteredUsers();
  const found = users.find(
    (u) =>
      u.user.email.toLowerCase() === cleanId ||
      u.user.username.toLowerCase() === cleanId
  );

  if (!found || found.passwordHash !== cleanPass) {
    return {
      success: false,
      error: "ভুল ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
    };
  }

  const session: AuthSession = {
    user: found.user,
    token: `auth_token_${found.user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };

  saveSession(session);
  return { success: true, session };
}

/**
 * Register a new user
 */
export async function registerUser(params: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  district?: string;
}): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const { fullName, email, username, password, confirmPassword, role, district } = params;

  if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
    return { success: false, error: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
  }

  if (password.length < 6) {
    return { success: false, error: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "পাসওয়ার্ড দুটি মেলেনি!" };
  }

  const users = getRegisteredUsers();
  const duplicate = users.find(
    (u) =>
      u.user.email.toLowerCase() === email.trim().toLowerCase() ||
      u.user.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (duplicate) {
    return { success: false, error: "এই ইমেইল বা ব্যবহারকারীর নামে ইতিমধ্যে অ্যাকাউন্ট রয়েছে।" };
  }

  const newUser: AuthUser = {
    id: `user_${Date.now()}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    role: role || "citizen",
    isDemo: false,
    createdAt: new Date().toISOString(),
    district: district || "sirajganj",
  };

  users.push({ user: newUser, passwordHash: password });
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to store user:", e);
  }

  const session: AuthSession = {
    user: newUser,
    token: `auth_token_${newUser.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  saveSession(session);
  return { success: true, session };
}
