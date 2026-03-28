"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Mail,
  Pencil,
  Save,
  UserCircle,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/users";

interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  enrolledCourses?: string[];
  token?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/signin"); return; }
    try {
      const parsed: UserData = JSON.parse(stored);
      setUser(parsed);
      setFirstName(parsed.firstName);
      setLastName(parsed.lastName);
    } catch {
      router.push("/signin");
    }
  }, [router]);

  const handleSave = async () => {
    if (!firstName.trim()) { setError("First name cannot be empty."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      });
      const data = await res.json();
      if (data._id || data.firstName) {
        const updatedUser = { ...user, firstName: data.firstName, lastName: data.lastName };
        setUser(updatedUser as UserData);
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")!), firstName: data.firstName, lastName: data.lastName }));
        setSuccess("Name updated successfully!");
        setEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update name.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEditing(false);
    setError("");
  };

  const coursesCompleted = user?.enrolledCourses?.length ?? 0;
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-semibold text-gray-700">My Profile</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-700 text-sm tracking-wide uppercase">AcademiQ</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Avatar + Name Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl p-8 mb-6 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
              <UserCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{fullName || "Loading…"}</h1>
            <p className="text-blue-200 text-sm mt-1 capitalize">{user?.role || "student"}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{coursesCompleted}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Courses Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 break-all leading-snug">{user?.email || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Email Address</p>
            </div>
          </div>
        </div>

        {/* Edit Name Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Name
              </button>
            )}
          </div>

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="focus-visible:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="focus-visible:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 border-gray-200">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Full Name</span>
                <span className="text-sm font-medium text-gray-900">{fullName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm font-medium text-gray-900">@{user?.username || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-gray-900">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium capitalize text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {user?.role || "student"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Back to dashboard */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
