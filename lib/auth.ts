const API_BASE = "http://localhost:5000/api/users";

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
  return res.json();
}

export async function apiVerifyEmail(data: { email: string; otp: string }) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiForgotPassword(data: { email: string }) {
  const res = await fetch(`${API_BASE}/forgotpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
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
  return res.json();
}
