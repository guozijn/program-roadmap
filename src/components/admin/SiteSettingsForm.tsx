"use client";

import { useState } from "react";

const SECTIONS = [
  {
    title: "Home Page: Hero",
    keys: [
      { key: "home.hero.title", label: "Hero Headline", type: "text", placeholder: "Chart Your Path to Success" },
      { key: "home.hero.subtitle", label: "Hero Subtitle", type: "textarea", placeholder: "Explore programs, connect with industry..." },
      { key: "home.hero.cta_primary", label: "Primary CTA Button Text", type: "text", placeholder: "Explore Programs" },
      { key: "home.hero.cta_secondary", label: "Secondary CTA Button Text", type: "text", placeholder: "Meet Our Alumni" },
    ],
  },
  {
    title: "Home Page: Statistics",
    keys: [
      { key: "home.stats.students", label: "Students Count", type: "text", placeholder: "12,000+" },
      { key: "home.stats.programs", label: "Programs Count", type: "text", placeholder: "50+" },
      { key: "home.stats.alumni", label: "Alumni Count", type: "text", placeholder: "80,000+" },
      { key: "home.stats.partners", label: "Partners Count", type: "text", placeholder: "200+" },
    ],
  },
  {
    title: "Home Page: About Section",
    keys: [
      { key: "home.about.title", label: "Section Title", type: "text", placeholder: "Your Academic Journey, Visualised" },
      { key: "home.about.description", label: "Section Description", type: "textarea", placeholder: "Description text..." },
    ],
  },
  {
    title: "Page Introductions",
    keys: [
      { key: "programs.intro", label: "Programs Page Intro", type: "textarea", placeholder: "Introduction text for the programs page..." },
      { key: "alumni.intro", label: "Alumni Page Intro", type: "textarea", placeholder: "Introduction text for the alumni page..." },
      { key: "industry.intro", label: "Industry Page Intro", type: "textarea", placeholder: "Introduction text for the industry page..." },
    ],
  },
  {
    title: "Contact Information",
    keys: [
      { key: "contact.email", label: "Contact Email", type: "text", placeholder: "info@programroadmap.edu.au" },
      { key: "contact.phone", label: "Contact Phone", type: "text", placeholder: "+61 8 8313 5208" },
      { key: "contact.address", label: "Address", type: "text", placeholder: "North Terrace, Adelaide SA 5005" },
    ],
  },
];

export default function SiteSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const requestInit = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      };

      let res = await fetch("/api/settings", {
        method: "PUT",
        ...requestInit,
      });

      if (res.status === 405) {
        res = await fetch("/api/settings", {
          method: "POST",
          ...requestInit,
        });
      }

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(`Failed to save settings (${res.status}${data.error ? `: ${data.error}` : ""})`);
      }
    } catch {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">{section.title}</h2>
          <div className="space-y-4">
            {section.keys.map((field) => (
              <div key={field.key}>
                <label className="form-label text-sm">{field.label}</label>
                <p className="text-xs text-gray-400 mb-1 font-mono">{field.key}</p>
                {field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                    className="form-input"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-0 py-4 flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
