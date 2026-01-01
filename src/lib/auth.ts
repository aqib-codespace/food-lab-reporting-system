const AUTH_TOKEN_KEY = "foodlab_auth_token";
const AUTH_USER_KEY = "foodlab_user";

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  token: string;
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { success: false, error: "Server configuration error" };
  }

  if (email === adminEmail && password === adminPassword) {
    const token = generateToken(email);

    const user: AuthUser = {
      email,
      name: "Admin User",
      role: "admin",
      token,
    };

    return { success: true, user };
  }

  return { success: false, error: "Invalid email or password" };
}

function generateToken(email: string): string {
  const timestamp = Date.now();
  const secret = process.env.JWT_SECRET;
  const tokenData = `${email}:${timestamp}:${secret}`;
  return Buffer.from(tokenData).toString("base64");
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");

    if (parts.length !== 3) return false;

    const [email, timestamp, secret] = parts;
    const expectedSecret = process.env.JWT_SECRET;

    if (secret !== expectedSecret) return false;

    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;

    return tokenAge < maxAge;
  } catch {
    return false;
  }
}

export const clientAuth = {
  setAuth(user: AuthUser) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, user.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
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

  clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  isAuthenticated(): boolean {
    const auth = this.getAuth();
    return auth !== null && verifyToken(auth.token);
  },
};
