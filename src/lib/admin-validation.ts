export const PROGRAM_LEVELS = ["Bachelor", "Masters", "PhD", "Diploma"] as const;
export const PROGRAM_DURATIONS = ["1 year", "1.5 years", "2 years", "3 years", "4 years"] as const;
export const PARTNER_CATEGORIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Engineering",
  "Government",
  "Education",
  "Energy",
  "Retail",
  "Other",
] as const;
export const PARTNER_TIERS = ["GOLD", "SILVER", "BRONZE"] as const;

export interface ProgramInput {
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  overview: string;
  featured: boolean;
  published: boolean;
}

export interface AlumniInput {
  name: string;
  role: string;
  company: string;
  graduationYear: number;
  bio: string;
  testimonial: string;
  featured: boolean;
  linkedin: string;
  programId: string;
}

export interface PartnerInput {
  name: string;
  description: string;
  website: string;
  category: string;
  tier: string;
  published: boolean;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSlug(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function normalizeYear(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseSafeExternalUrl(value: string): URL | null {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    return HTTP_PROTOCOLS.has(parsed.protocol) ? parsed : null;
  } catch {
    return null;
  }
}

export function getSafeExternalUrl(value: unknown): string | null {
  const normalized = normalizeString(value);
  const parsed = parseSafeExternalUrl(normalized);
  return parsed ? parsed.toString() : null;
}

export function getSafeLinkedInUrl(value: unknown): string | null {
  return getSafeExternalUrl(value);
}

export function validateSlug(slug: string): string | null {
  if (!slug) return "Program slug is required.";
  if (!SLUG_PATTERN.test(slug)) {
    return "Please enter a valid slug format using lowercase letters, numbers, and hyphens only.";
  }
  return null;
}

export function validateExternalUrl(url: string, label = "URL"): string | null {
  if (!url) return null;
  return getSafeExternalUrl(url) ? null : `Please enter a valid ${label} format starting with http:// or https://.`;
}

export function validateLinkedInUrl(url: string): string | null {
  if (!url) return null;
  return getSafeLinkedInUrl(url) ? null : "Please enter a valid website URL format starting with http:// or https://.";
}

export function normalizeProgramInput(input: Partial<ProgramInput>): ProgramInput {
  return {
    title: normalizeString(input.title),
    slug: normalizeSlug(input.slug),
    description: normalizeString(input.description),
    level: normalizeString(input.level) || PROGRAM_LEVELS[0],
    duration: normalizeString(input.duration) || PROGRAM_DURATIONS[3],
    overview: normalizeString(input.overview),
    featured: Boolean(input.featured),
    published: input.published !== false,
  };
}

export function validateProgramInput(input: ProgramInput): string | null {
  if (!input.title) return "Program title is required.";
  if (!input.description) return "Short description is required.";

  const slugError = validateSlug(input.slug);
  if (slugError) return slugError;

  if (!PROGRAM_LEVELS.includes(input.level as (typeof PROGRAM_LEVELS)[number])) {
    return "Program level is invalid.";
  }

  if (!PROGRAM_DURATIONS.includes(input.duration as (typeof PROGRAM_DURATIONS)[number])) {
    return "Program duration is invalid.";
  }

  return null;
}

export function normalizeAlumniInput(input: Partial<AlumniInput>): AlumniInput {
  return {
    name: normalizeString(input.name),
    role: normalizeString(input.role),
    company: normalizeString(input.company),
    graduationYear: normalizeYear(input.graduationYear),
    bio: normalizeString(input.bio),
    testimonial: normalizeString(input.testimonial),
    featured: Boolean(input.featured),
    linkedin: normalizeString(input.linkedin),
    programId: normalizeString(input.programId),
  };
}

export function validateAlumniInput(input: AlumniInput): string | null {
  if (!input.name) return "Full name is required.";
  if (!input.role) return "Role is required.";
  if (!input.company) return "Company is required.";

  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(input.graduationYear) || input.graduationYear < 1900 || input.graduationYear > currentYear + 10) {
    return `Graduation year must be between 1900 and ${currentYear + 10}.`;
  }

  const linkedInError = validateLinkedInUrl(input.linkedin);
  if (linkedInError) return linkedInError;

  return null;
}

export function normalizePartnerInput(input: Partial<PartnerInput>): PartnerInput {
  return {
    name: normalizeString(input.name),
    description: normalizeString(input.description),
    website: normalizeString(input.website),
    category: normalizeString(input.category) || PARTNER_CATEGORIES[0],
    tier: normalizeString(input.tier) || PARTNER_TIERS[1],
    published: input.published !== false,
  };
}

export function validatePartnerInput(input: PartnerInput): string | null {
  if (!input.name) return "Company name is required.";

  const websiteError = validateExternalUrl(input.website, "Website URL");
  if (websiteError) return websiteError;

  if (!PARTNER_CATEGORIES.includes(input.category as (typeof PARTNER_CATEGORIES)[number])) {
    return "Partner category is invalid.";
  }

  if (!PARTNER_TIERS.includes(input.tier as (typeof PARTNER_TIERS)[number])) {
    return "Partnership tier is invalid.";
  }

  return null;
}
