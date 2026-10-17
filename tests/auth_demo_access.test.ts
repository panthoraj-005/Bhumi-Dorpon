import { describe, it, expect } from "vitest";
import {
  createDemoSession,
  authenticateUser,
  registerUser,
  DEMO_USER,
} from "../lib/auth";

describe("Authentication & Demo Access Module", () => {
  it("creates a safe, unprivileged demo session bypassing login", () => {
    const session = createDemoSession();
    expect(session).toBeDefined();
    expect(session.user.isDemo).toBe(true);
    expect(session.user.role).toBe("demo");
    expect(session.user.fullName).toContain("ডেমো পরিদর্শক");
    expect(session.token).toContain("demo_token_");
  });

  it("authenticates existing mock users with valid credentials", async () => {
    const res = await authenticateUser("surveyor", "password123");
    expect(res.success).toBe(true);
    expect(res.session).toBeDefined();
    expect(res.session?.user.role).toBe("surveyor");
    expect(res.session?.user.isDemo).toBe(false);
  });

  it("rejects invalid login credentials gracefully", async () => {
    const res = await authenticateUser("surveyor", "wrongpassword");
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("validates password length and matching confirmation during registration", async () => {
    const mismatch = await registerUser({
      fullName: "টেস্ট ইউজার",
      email: "test@example.com",
      username: "testuser",
      password: "password123",
      confirmPassword: "password999",
      role: "citizen",
    });
    expect(mismatch.success).toBe(false);
    expect(mismatch.error).toContain("পাসওয়ার্ড দুটি মেলেনি");

    const tooShort = await registerUser({
      fullName: "টেস্ট ইউজার",
      email: "test2@example.com",
      username: "testuser2",
      password: "123",
      confirmPassword: "123",
      role: "citizen",
    });
    expect(tooShort.success).toBe(false);
    expect(tooShort.error).toContain("৬ অক্ষর");
  });
});

