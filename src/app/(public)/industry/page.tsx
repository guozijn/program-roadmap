import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { IndustryIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Industry Partners",
  description: "Discover our industry partnerships and how they shape your education.",
};

async function getData() {
  const [partners, intro] = await Promise.all([
    prisma.industryPartner.findMany({
      where: { published: true },
      orderBy: [
        { tier: "asc" },
        { name: "asc" },
      ],
    }),
    prisma.siteSettings.findUnique({ where: { key: "industry.intro" } }),
  ]);
  return { partners, intro: intro?.value || "" };
}

const TIER_ORDER = ["GOLD", "SILVER", "BRONZE"];
const TIER_LABELS: Record<string, { label: string; desc: string; color: string; badgeColor: string }> = {
  GOLD: {
    label: "Gold Partners",
    desc: "Our premier partners, collaborating on research, curriculum development and graduate employment.",
    color: "border-amber-400",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  SILVER: {
    label: "Silver Partners",
    desc: "Active collaborators providing capstone projects, internships and industry guest lectures.",
    color: "border-gray-400",
    badgeColor: "bg-gray-50 text-gray-600 border-gray-200",
  },
  BRONZE: {
    label: "Bronze Partners",
    desc: "Industry supporters contributing to student events, hackathons and networking opportunities.",
    color: "border-orange-300",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const benefitIcons = [
  {
    title: "Curriculum Input",
    desc: "Partners shape curriculum to reflect real industry needs",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Capstone Projects",
    desc: "Students solve real business challenges for partners",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Graduate Talent",
    desc: "Direct access to our top graduating talent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Joint Research",
    desc: "Collaborative research addressing industry problems",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default async function IndustryPage() {
  const { partners, intro } = await getData();

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    partners: partners.filter((p) => p.tier === tier),
  })).filter((g) => g.partners.length > 0);

  const categories = Array.from(new Set(partners.map((p) => p.category))).sort();

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden min-h-[280px] flex items-center">
        <Image
          src="/images/banner-industry.jpg"
          alt="Adelaide University Industry Partners"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container-page relative z-10 py-16 md:py-20">
          <nav className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Industry Partners</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Industry Partners</h1>
          <p className="text-white/70 text-lg max-w-2xl">{intro}</p>
        </div>
      </section>

      {/* Partnership benefits */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitIcons.map((b) => (
              <div key={b.title} className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy mx-auto mb-3">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-navy mb-1">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-gray-50 py-4 border-b border-gray-100 sticky top-16 z-40">
        <div className="container-page">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-medium text-gray-500 flex-shrink-0">Category:</span>
            <a href="#all" className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-navy text-white">All</a>
            {categories.map((cat) => (
              <a key={cat} href={`#${cat.toLowerCase()}`} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-navy hover:text-navy transition-colors">
                <IndustryIcon category={cat} className="w-3.5 h-3.5" />
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Partners by Tier */}
      <section id="all" className="section-padding bg-gray-50">
        <div className="container-page space-y-16">
          {grouped.map(({ tier, partners: tierPartners }) => {
            const info = TIER_LABELS[tier];
            return (
              <div key={tier}>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-navy">{info.label}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${info.badgeColor}`}>
                      {tierPartners.length} partners
                    </span>
                  </div>
                  <p className="text-gray-500">{info.desc}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tierPartners.map((partner) => (
                    <div
                      key={partner.id}
                      id={partner.category.toLowerCase()}
                      className={`card hover:shadow-card-hover transition-shadow border-l-4 ${info.color}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy">
                              <IndustryIcon category={partner.category} className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-navy">{partner.name}</h3>
                              <span className="text-xs text-gray-500">{partner.category}</span>
                            </div>
                          </div>
                        </div>

                        {partner.description && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">{partner.description}</p>
                        )}

                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-navy hover:text-brand font-medium transition-colors"
                          >
                            Visit Website
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="bg-navy py-16">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Become a Partner</h2>
            <p className="text-white/70 mb-8">
              Join our growing network of industry partners and help shape the next generation of technology and business leaders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:partnerships@programroadmap.edu.au" className="btn-gold">
                Get in Touch
              </a>
              <Link href="/programs" className="btn-outline">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
