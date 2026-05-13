"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import {
  PARTNER_CATEGORIES,
  PARTNER_TIERS,
  normalizePartnerInput,
  validatePartnerInput,
} from "@/lib/admin-validation";

interface Partner {
  id?: string;
  name: string;
  description: string;
  website: string;
  category: string;
  tier: string;
  published: boolean;
}

export default function IndustryPartnerForm({ initialData }: { initialData?: Partner }) {
  const router = useRouter();
  const [form, setForm] = useState<Partner>(initialData || {
    name: "", description: "", website: "", category: "Technology", tier: "SILVER", published: true,
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);

    const normalizedForm = normalizePartnerInput(form);
    const validationError = validatePartnerInput(normalizedForm);
    if (validationError) {
      setNotice({ tone: "error", message: validationError });
      return;
    }

    setLoading(true);

    try {
      const url = initialData?.id ? `/api/industry/${initialData.id}` : "/api/industry";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedForm),
      });

      if (!res.ok) {
        const data = await res.json();
        setNotice({ tone: "error", message: data.error || "An error occurred" });
        return;
      }

      setNotice({ tone: "success", message: initialData ? "Industry partner saved successfully." : "Industry partner created successfully." });
      router.push("/admin/dashboard/industry");
      router.refresh();
    } catch {
      setNotice({ tone: "error", message: "Failed to save partner" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {notice && <AdminNotice tone={notice.tone} message={notice.message} />}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="form-label">Company Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input" placeholder="Google" required />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="form-input">
              {PARTNER_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Partnership Tier</label>
            <select value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))} className="form-input">
              {PARTNER_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Website URL</label>
            <input type="text" inputMode="url" autoCapitalize="off" spellCheck={false}
              value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="form-input" placeholder="https://company.com" />
            <p className="text-xs text-gray-400 mt-1">Optional. Please enter a valid website URL format.</p>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-input resize-none" rows={4}
              placeholder="Describe the partnership and how the company collaborates with the program..." />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="w-4 h-4 accent-navy rounded" />
          <span className="text-sm text-gray-700">Published (visible on industry page)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
          {loading ? "Saving..." : initialData ? "Save Changes" : "Add Partner"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline-navy">Cancel</button>
      </div>
    </form>
  );
}
