import { supabase } from "./supabase/client";
import * as jose from "jose";

const AUTH_TOKEN_KEY = "foodlab_auth_token";
const AUTH_USER_KEY = "foodlab_user";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string;
}

/**
 * Verify user credentials against the database
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // Query user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Type assertion for user data
    const userData = user as any;

    // Check if user is active
    if (!userData.is_active) {
      return {
        success: false,
        error: "Account is inactive. Please contact administrator.",
      };
    }

    // Direct password comparison (NOT SECURE - for development only)
    if (password !== userData.password_hash) {
      return { success: false, error: "Invalid email or password" };
    }

    // Generate JWT token
    const token = await generateJWT({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    });

    const authUser: AuthUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      token,
    };

    return { success: true, user: authUser };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Generate JWT token using jose library
 */
async function generateJWT(payload: {
  userId: number;
  email: string;
  role: string;
}): Promise<string> {
  try {
    const token = await new jose.SignJWT({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(
  token: string
): Promise<{ valid: boolean; payload?: any }> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
}


export const clientAuth = {
  setAuth(user: AuthUser) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, user.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

      // Set HTTP-only style cookie (client-side version)
      document.cookie = `${AUTH_TOKEN_KEY}=${user.token}; path=/; max-age=86400; SameSite=Strict`;
    }
  },

  getAuth(): { token: string; user: AuthUser } | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !userStr) return null;

    try {
      const user = JSON.parse(userStr) as AuthUser;
      return { token, user };
    } catch {
      return null;
    }
  },

  getUser(): AuthUser | null {
    const auth = this.getAuth();
    return auth?.user || null;
  },

  clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      // Clear cookie
      document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },

  isAuthenticated(): boolean {
    const auth = this.getAuth();
    return auth !== null && auth.token.length > 20;
  },

  hasRole(requiredRole: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
  },
};
