const DEFAULT_API_BASE = "http://localhost:5000/api/users";
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE
).replace(/\/+$/, "");

async function parseJsonResponse(res: Response) {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function apiRegister(data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function apiVerifyEmail(data: { email: string; otp: string }) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function apiForgotPassword(data: { email: string }) {
  const res = await fetch(`${API_BASE}/forgotpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function apiResetPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  const res = await fetch(`${API_BASE}/resetpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}
