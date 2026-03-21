import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap, BookOpen, Globe, Handshake,
  ArrowRight, ChevronRight,
} from "@/components/ui/Icons";

async function getSiteData() {
  const [settings, featuredPrograms, featuredAlumni, partners] = await Promise.all([
    prisma.siteSettings.findMany(),
    prisma.program.findMany({ where: { featured: true, published: true }, take: 4 }),
    prisma.alumni.findMany({ where: { featured: true }, take: 3 }),
    prisma.industryPartner.findMany({ where: { published: true, tier: "GOLD" }, take: 6 }),
  ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return { settingsMap, featuredPrograms, featuredAlumni, partners };
}

const LEVEL_COLORS: Record<string, string> = {
  Bachelor: "bg-brand-50 text-brand border-brand-100",
  Masters: "bg-purple-50 text-purple border-purple-100",
  PhD: "bg-navy-50 text-navy border-navy-100",
};

const LEVEL_BAR: Record<string, string> = {
  Bachelor: "bg-brand",
  Masters: "bg-purple",
  PhD: "bg-navy",
  Diploma: "bg-gray-400",
};

const STEP_ICONS = [
  <svg key="explore" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>,
  <svg key="plan" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>,
  <svg key="connect" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
];

export default async function HomePage() {
  const { settingsMap: s, featuredPrograms, featuredAlumni, partners } = await getSiteData();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[620px] flex items-center">
        {/* Background campus image */}
        <Image
          src="/images/hero-campus-main.jpg"
          alt="Adelaide University North Terrace Campus"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/70" />
        {/* Subtle gradient overlay for text readability */}

        <div className="container-page relative z-10 py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.12] mb-6 tracking-tight">
              {s["home.hero.title"] || "Chart Your Path to Success"}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl">
              {s["home.hero.subtitle"] || "Explore programs, connect with industry, and discover where your degree can take you."}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/programs" className="btn-gold gap-2">
                {s["home.hero.cta_primary"] || "Explore Programs"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/alumni" className="btn-outline">
                {s["home.hero.cta_secondary"] || "Meet Our Alumni"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-cream border-b border-cream-dark">
        <div className="container-page py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-cream-dark">
            {[
              { value: s["home.stats.students"] || "12,000+", label: "Current Students", Icon: GraduationCap },
              { value: s["home.stats.programs"] || "50+", label: "Programs", Icon: BookOpen },
              { value: s["home.stats.alumni"] || "80,000+", label: "Alumni Worldwide", Icon: Globe },
              { value: s["home.stats.partners"] || "200+", label: "Industry Partners", Icon: Handshake },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-6 py-4 first:pl-0 last:pr-0">
                <stat.Icon className="w-6 h-6 text-brand mb-3" />
                <span className="text-3xl font-bold text-navy tracking-tight">{stat.value}</span>
                <span className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / How it works ─────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Your Journey</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-5">
                {s["home.about.title"] || "Your Academic Journey, Visualised"}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                {s["home.about.description"] || "We help students navigate their degree with clarity and confidence."}
              </p>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Explore Programs", desc: "Browse our full range of undergraduate and postgraduate programs" },
                  { step: "02", title: "Plan Your Roadmap", desc: "See exactly which courses you'll take, semester by semester" },
                  { step: "03", title: "Connect & Succeed", desc: "Engage with industry partners and alumni who've been where you're going" },
                ].map((item, i) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand flex items-center justify-center flex-shrink-0">
                      {STEP_ICONS[i]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand tracking-widest mb-0.5">STEP {item.step}</p>
                      <h3 className="font-semibold text-navy">{item.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap preview visual */}
            <div className="relative">
              <div className="bg-cream rounded-2xl p-8 border border-cream-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 rounded-bl-full" />

                {/* Year timeline */}
                <div className="space-y-3 relative z-10">
                  {[
                    { label: "Year 1", sublabel: "Foundations", color: "bg-navy", width: "w-full" },
                    { label: "Year 2", sublabel: "Core Skills", color: "bg-brand", width: "w-full" },
                    { label: "Year 3", sublabel: "Specialisation", color: "bg-purple", width: "w-3/4" },
                  ].map((yr, i) => (
                    <div key={yr.label} className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${yr.color} mt-2.5 flex-shrink-0`} />
                      <div className="flex-1 bg-white rounded-xl p-3.5 shadow-sm border border-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-navy">{yr.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{yr.sublabel}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {Array.from({ length: i === 2 ? 3 : 4 }).map((_, j) => (
                            <div
                              key={j}
                              className="h-5 rounded"
                              style={{
                                width: `${52 + j * 12}px`,
                                background: i === 0 ? "rgba(20,15,80,0.12)" : i === 1 ? "rgba(20,72,255,0.12)" : "rgba(105,86,204,0.12)"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Graduation */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1 bg-navy rounded-xl p-3.5">
                      <p className="text-white text-xs font-semibold flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                        </svg>
                        Graduation &amp; Career Outcomes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Programs ─────────────────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Degrees &amp; Courses</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">Featured Programs</h2>
            </div>
            <Link href="/programs" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all programs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPrograms.map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="card card-hover group flex flex-col"
              >
                <div className={`h-1 ${LEVEL_BAR[program.level] || "bg-gray-300"}`} />
                <div className="p-6 flex flex-col flex-1">
                  <span className={`inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${LEVEL_COLORS[program.level] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {program.level}
                  </span>
                  <h3 className="font-bold text-navy text-base leading-snug mb-2 group-hover:text-brand transition-colors flex-1">
                    {program.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{program.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {program.duration}
                    </span>
                    <span className="text-brand text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Roadmap <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alumni Spotlight ──────────────────────────────────────────────── */}
      {featuredAlumni.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Success Stories</p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy">Alumni Spotlight</h2>
              </div>
              <Link href="/alumni" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Meet all alumni <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredAlumni.map((alumni) => (
                <div key={alumni.id} className="card p-7 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {alumni.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy text-sm truncate">{alumni.name}</p>
                      <p className="text-xs text-gray-500 truncate">{alumni.role}</p>
                      <p className="text-xs font-semibold text-brand truncate">{alumni.company}</p>
                    </div>
                  </div>

                  {alumni.testimonial && (
                    <blockquote className="flex-1">
                      {/* Quote mark */}
                      <svg className="w-8 h-6 text-brand/20 mb-2" fill="currentColor" viewBox="0 0 32 22">
                        <path d="M0 22V13.818C0 5.455 5.455 1.09 16.364 0l1.09 2.182C12.364 3.455 9.818 6.182 9.636 10H16V22H0zm18.182 0V13.818C18.182 5.455 23.636 1.09 34.545 0l1.09 2.182c-5.09 1.273-7.636 4-7.818 7.818H34v12H18.182z" />
                      </svg>
                      <p className="text-gray-600 text-sm leading-relaxed">{alumni.testimonial}</p>
                    </blockquote>
                  )}

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Class of {alumni.graduationYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Industry Partners ─────────────────────────────────────────────── */}
      {partners.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Industry Connections</p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy">Our Partners</h2>
                <p className="text-gray-500 mt-3 max-w-lg text-sm leading-relaxed">
                  {s["industry.intro"] || "Leading organisations that help shape our programs and connect our students."}
                </p>
              </div>
              <Link href="/industry" className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all flex-shrink-0">
                All partners <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {partners.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-card transition-shadow">
                  {/* Logo placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{p.name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy text-sm truncate">{p.name}</p>
                    <span className="text-xs text-gray-400">{p.category}</span>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold text-brand bg-brand-50 border border-brand-100 rounded-full px-2 py-0.5 flex-shrink-0">
                    {p.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute right-0 bottom-0 w-96 h-96" style={{ background: "radial-gradient(circle, rgba(20,72,255,0.15) 0%, transparent 70%)" }} />
        </div>
        <div className="container-page relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Explore our programs, meet our alumni, and discover how we connect you with world-leading organisations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/programs" className="btn-gold">
              Find Your Program
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/industry" className="btn-outline">
              Industry Connections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
