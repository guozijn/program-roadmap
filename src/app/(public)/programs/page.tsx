import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description: "Browse all our programs and find your perfect academic pathway.",
};

const LEVEL_COLORS: Record<string, string> = {
  Bachelor: "bg-blue-50 text-navy border-blue-100",
  Masters: "bg-amber-50 text-amber-800 border-amber-100",
  PhD: "bg-purple-50 text-purple-800 border-purple-100",
  Diploma: "bg-gray-50 text-gray-700 border-gray-200",
};

const LEVEL_BAR_COLORS: Record<string, string> = {
  Bachelor: "bg-navy",
  Masters: "bg-amber-500",
  PhD: "bg-purple-600",
  Diploma: "bg-gray-500",
};

async function getPrograms() {
  return prisma.program.findMany({
    where: { published: true },
    include: { _count: { select: { courses: true, alumni: true } } },
    orderBy: [{ featured: "desc" }, { title: "asc" }],
  });
}

async function getIntro() {
  const s = await prisma.siteSettings.findUnique({ where: { key: "programs.intro" } });
  return s?.value || "";
}

export default async function ProgramsPage() {
  const [programs, intro] = await Promise.all([getPrograms(), getIntro()]);

  const levels = ["Bachelor", "Masters", "PhD", "Diploma"];
  const groupedByLevel = levels
    .map((level) => ({
      level,
      programs: programs.filter((p) => p.level === level),
    }))
    .filter((g) => g.programs.length > 0);

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden min-h-[280px] flex items-center">
        <Image
          src="/images/banner-programs.jpg"
          alt="Adelaide University Programs"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container-page relative z-10 py-16 md:py-20">
          <nav className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Programs</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Programs</h1>
          <p className="text-white/70 text-lg max-w-2xl">{intro}</p>
        </div>
      </section>

      {/* Program Level Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container-page">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            <a href="#all" className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-navy text-white">
              All Programs
            </a>
            {levels.map((level) => (
              programs.some((p) => p.level === level) && (
                <a key={level} href={`#${level.toLowerCase()}`} className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  {level}
                </a>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section id="all" className="section-padding bg-gray-50">
        <div className="container-page">
          {groupedByLevel.map(({ level, programs: levelPrograms }) => (
            <div key={level} id={level.toLowerCase()} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-navy">{level} Programs</h2>
                <span className="text-xs font-medium bg-gray-200 text-gray-600 rounded-full px-3 py-1">
                  {levelPrograms.length} {levelPrograms.length === 1 ? "program" : "programs"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelPrograms.map((program) => (
                  <Link key={program.id} href={`/programs/${program.slug}`} className="card card-hover group flex flex-col">
                    <div className={`h-1.5 ${LEVEL_BAR_COLORS[program.level] || "bg-gray-400"}`} />
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${LEVEL_COLORS[program.level] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                          {program.level}
                        </span>
                        {program.featured && (
                          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-gold text-navy">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-navy-light transition-colors leading-snug">
                        {program.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{program.description}</p>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {program._count.courses} courses
                          </span>
                        </div>
                        <span className="text-navy text-xs font-semibold group-hover:text-gold transition-colors flex items-center gap-1">
                          View Roadmap
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-white/70 mb-8">Contact our student advisory team for personalised guidance.</p>
          <a href="mailto:info@programroadmap.edu.au" className="btn-gold">
            Contact Student Advisors
          </a>
        </div>
      </section>
    </>
  );
}
