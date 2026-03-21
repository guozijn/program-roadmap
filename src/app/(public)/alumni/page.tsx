import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Meet our graduates and hear their success stories.",
};

async function getData() {
  const [alumni, intro, programs] = await Promise.all([
    prisma.alumni.findMany({
      include: { program: { select: { title: true, slug: true } } },
      orderBy: [{ featured: "desc" }, { graduationYear: "desc" }],
    }),
    prisma.siteSettings.findUnique({ where: { key: "alumni.intro" } }),
    prisma.program.findMany({ where: { published: true }, select: { id: true, title: true } }),
  ]);
  return { alumni, intro: intro?.value || "", programs };
}

export default async function AlumniPage() {
  const { alumni, intro, programs } = await getData();

  const featured = alumni.filter((a) => a.featured);
  const rest = alumni.filter((a) => !a.featured);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden min-h-[280px] flex items-center">
        <Image
          src="/images/banner-alumni.jpg"
          alt="Adelaide University Alumni"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container-page relative z-10 py-16 md:py-20">
          <nav className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Alumni</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Alumni Stories</h1>
          <p className="text-white/70 text-lg max-w-2xl">{intro}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container-page">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-navy">80,000+</p>
              <p className="text-sm text-gray-500 mt-1">Graduates Worldwide</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">150+</p>
              <p className="text-sm text-gray-500 mt-1">Countries Represented</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">95%</p>
              <p className="text-sm text-gray-500 mt-1">Employment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Alumni */}
      {featured.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-navy mb-8">Featured Alumni</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((alumnus) => (
                <div key={alumnus.id} className="card flex flex-col">
                  <div className="h-2 bg-gold" />
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-full bg-navy-50 border-2 border-navy/10 flex items-center justify-center text-navy font-bold text-xl flex-shrink-0">
                        {alumnus.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{alumnus.name}</h3>
                        <p className="text-sm text-gray-600">{alumnus.role}</p>
                        <p className="text-sm font-semibold text-navy">{alumnus.company}</p>
                      </div>
                    </div>

                    {alumnus.testimonial && (
                      <blockquote className="flex-1 mb-5">
                        <svg className="w-6 h-6 text-gold/50 mb-2" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
                        </svg>
                        <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{alumnus.testimonial}&rdquo;</p>
                      </blockquote>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Class of {alumnus.graduationYear}
                        {alumnus.program && (
                          <> · <Link href={`/programs/${alumnus.program.slug}`} className="text-navy hover:underline">{alumnus.program.title}</Link></>
                        )}
                      </div>
                      {alumnus.linkedin && (
                        <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer" className="text-navy hover:text-gold transition-colors" aria-label="LinkedIn">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Alumni */}
      {rest.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-navy mb-8">More Success Stories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((alumnus) => (
                <div key={alumnus.id} className="card p-6 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">
                      {alumnus.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{alumnus.name}</h3>
                      <p className="text-xs text-gray-500">{alumnus.role}</p>
                      <p className="text-xs font-medium text-navy">{alumnus.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Class of {alumnus.graduationYear}</span>
                    {alumnus.program && (
                      <Link href={`/programs/${alumnus.program.slug}`} className="text-navy hover:underline truncate ml-2 max-w-[120px]">
                        {alumnus.program.title}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Programs CTA */}
      <section className="bg-navy py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Writing Your Own Story</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">Explore our programs and discover how your academic journey can lead to an incredible career.</p>
          <Link href="/programs" className="btn-gold">
            Explore Programs
          </Link>
        </div>
      </section>
    </>
  );
}
