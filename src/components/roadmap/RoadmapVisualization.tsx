"use client";

import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  year: number;
  semester: number;
  courseType: string;
  units: number;
  sortOrder: number;
}

interface CareerOutcome {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RoadmapProps {
  courses: Course[];
  careerOutcomes: CareerOutcome[];
  duration: string;
}

interface TooltipState {
  course: Course;
  left: number;
  top: number;
  arrowLeft: number;
  placement: "top" | "bottom";
}

const TOOLTIP_WIDTH = 224;
const TOOLTIP_OFFSET = 10;
const TOOLTIP_SAFE_PADDING = 12;
const TOOLTIP_MIN_TOP_SPACE = 180;

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  CORE: { bg: "bg-navy", border: "border-navy", text: "text-white", label: "Core" },
  ELECTIVE: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700", label: "Elective" },
  SPECIALIZATION: { bg: "bg-teal-600", border: "border-teal-600", text: "text-white", label: "Specialization" },
  CAPSTONE: { bg: "bg-gold", border: "border-gold", text: "text-navy", label: "Capstone" },
  INDUSTRY: { bg: "bg-green-600", border: "border-green-600", text: "text-white", label: "Industry" },
};

function OutcomeIcon({ name, className }: { name: string; className?: string }) {
  const iconClassName = className || "w-4 h-4";

  switch (name) {
    case "code":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      );
    case "brain":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.5 4a3.5 3.5 0 00-3.5 3.5V8A3 3 0 003 11a3 3 0 003 3v.5A3.5 3.5 0 009.5 18H10m4.5-14A3.5 3.5 0 0118 7.5V8a3 3 0 013 3 3 3 0 01-3 3v.5A3.5 3.5 0 0114.5 18H14m-4-8h4m-4 4h4m-2-8v12" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 6V5a3 3 0 013-3 3 3 0 013 3v1m-9 4h12m-14 0h16a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a1 1 0 011-1z" />
        </svg>
      );
    case "server":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm3-9h.01M7 17h.01" />
        </svg>
      );
    case "shield":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
        </svg>
      );
    case "target":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m0-12.728l2.121 2.121m8.486 8.486l2.121 2.121M15 12a3 3 0 11-6 0 3 3 0 016 0zm4 0a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "chart":
    case "trending":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 19h16M7 15l3-3 3 2 4-5" />
        </svg>
      );
    case "database":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5c4.418 0 8 1.343 8 3s-3.582 3-8 3-8-1.343-8-3 3.582-3 8-3zm8 7c0 1.657-3.582 3-8 3s-8-1.343-8-3m16 4c0 1.657-3.582 3-8 3s-8-1.343-8-3V8" />
        </svg>
      );
    case "flask":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 3h4m-1 0v5.586l4.95 7.425A2 2 0 0116.287 19H7.713a2 2 0 01-1.663-3.989L11 8.586V3m-3 9h8" />
        </svg>
      );
    case "layers":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4l8 4-8 4-8-4 8-4zm-8 8l8 4 8-4m-16 4l8 4 8-4" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
      );
    case "users":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M10 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "message":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h8M8 14h5m-9 5l1.5-4.5A8 8 0 114 19z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l2.4 4.864 5.37.78-3.885 3.787.917 5.35L12 15.253l-4.802 2.528.917-5.35L4.23 8.644l5.37-.78L12 3z" />
        </svg>
      );
  }
}

function AcademicCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14L3 9l9-5 9 5-9 5zm0 0l6.16-3.422A12.083 12.083 0 0118 14.5C18 16.985 15.314 19 12 19s-6-2.015-6-4.5c0-1.347.58-2.556 1.84-3.422L12 14z" />
    </svg>
  );
}

export default function RoadmapVisualization({ courses, careerOutcomes, duration }: RoadmapProps) {
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Group courses by year and semester
  const years = Array.from(new Set(courses.map((c) => c.year))).sort();

  const getCourses = (year: number, semester: number) =>
    courses.filter((c) => c.year === year && c.semester === semester).sort((a, b) => a.sortOrder - b.sortOrder);

  const totalYears = parseInt(duration) || years.length;

  useEffect(() => {
    if (!tooltip) return;

    const dismissTooltip = () => {
      setHoveredCourseId(null);
      setTooltip(null);
    };

    window.addEventListener("scroll", dismissTooltip, true);
    window.addEventListener("resize", dismissTooltip);

    return () => {
      window.removeEventListener("scroll", dismissTooltip, true);
      window.removeEventListener("resize", dismissTooltip);
    };
  }, [tooltip]);

  const hideTooltip = () => {
    setHoveredCourseId(null);
    setTooltip(null);
  };

  const showTooltip = (course: Course, event: ReactMouseEvent<HTMLDivElement>) => {
    setHoveredCourseId(course.id);

    if (!course.description) {
      setTooltip(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const placement = rect.top > TOOLTIP_MIN_TOP_SPACE ? "top" : "bottom";
    const left = Math.min(
      Math.max(TOOLTIP_SAFE_PADDING, rect.left),
      window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_SAFE_PADDING
    );
    const anchorX = rect.left + Math.min(28, rect.width / 2);
    const arrowLeft = Math.min(Math.max(20, anchorX - left), TOOLTIP_WIDTH - 20);
    setTooltip({
      course,
      left,
      top: placement === "top" ? rect.top - TOOLTIP_OFFSET : rect.bottom + TOOLTIP_OFFSET,
      arrowLeft,
      placement,
    });
  };

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_STYLES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${style.bg}`} />
            <span className="text-xs text-gray-600">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="roadmap-container">
        <div className="flex gap-0 min-w-max">
          {years.map((year, yearIdx) => (
            <div key={year} className="flex flex-col min-w-0">
              {/* Year header */}
              <div className="flex items-center mb-4 px-4">
                <div className="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {year}
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold text-navy">Year {year}</p>
                  <p className="text-xs text-gray-400">
                    {year === 1 ? "Foundations" : year === totalYears ? "Specialisation" : "Core Skills"}
                  </p>
                </div>
                {yearIdx < years.length - 1 && (
                  <div className="ml-4 flex-1 h-px bg-gray-200 min-w-8" />
                )}
              </div>

              {/* Semesters */}
              <div className="flex gap-3 px-2">
                {[1, 2].map((sem) => {
                  const semCourses = getCourses(year, sem);
                  if (semCourses.length === 0) return null;

                  return (
                    <div key={sem} className="w-52">
                      <div className="text-xs font-medium text-gray-500 mb-2 ml-1">
                        Semester {sem}
                      </div>
                      <div className="space-y-2">
                        {semCourses.map((course) => {
                          const style = TYPE_STYLES[course.courseType] || TYPE_STYLES.CORE;
                          const isHovered = hoveredCourseId === course.id;

                          return (
                            <div
                              key={course.id}
                              className="course-node relative group"
                              onMouseEnter={(event) => showTooltip(course, event)}
                              onMouseLeave={hideTooltip}
                            >
                              <div
                                className={`rounded-lg border ${style.border} ${isHovered ? style.bg : "bg-white"}
                                  ${isHovered ? style.text : "text-gray-800"} p-3 cursor-default transition-all duration-200
                                  shadow-sm hover:shadow-md`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className={`text-[10px] font-mono ${isHovered ? "opacity-80" : "text-gray-400"}`}>
                                      {course.code}
                                    </p>
                                    <p className={`text-xs font-semibold leading-tight mt-0.5 ${isHovered ? "" : "text-gray-800"}`}>
                                      {course.title}
                                    </p>
                                  </div>
                                  <span
                                    className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-medium
                                      ${isHovered ? "bg-white/20 text-white" : `border ${style.border} text-gray-500`}`}
                                  >
                                    {course.units}u
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Year connector arrow */}
              {yearIdx < years.length - 1 && (
                <div className="flex items-center justify-end pr-2 mt-4">
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Career Outcomes */}
          <div className="ml-4 flex flex-col">
            <div className="flex items-center mb-4 px-4">
              <div className="bg-gold text-navy rounded-full w-8 h-8 flex items-center justify-center">
                <AcademicCapIcon className="w-4 h-4" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-semibold text-navy">Career</p>
                <p className="text-xs text-gray-400">Outcomes</p>
              </div>
            </div>

            <div className="px-2 w-48 space-y-2">
              {careerOutcomes.slice(0, 6).map((outcome) => (
                <div
                  key={outcome.id}
                  className="bg-gold-50 border border-gold/30 rounded-lg p-2.5 group hover:bg-gold hover:border-gold transition-all cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-navy">
                      <OutcomeIcon name={outcome.icon} className="w-4 h-4" />
                    </span>
                    <p className="text-xs font-medium text-navy leading-tight">{outcome.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className={`pointer-events-none fixed z-50 w-56 rounded-lg bg-navy p-3 text-xs text-white shadow-lg animate-fade-in ${
            tooltip.placement === "top" ? "-translate-y-full" : ""
          }`}
          style={{ top: tooltip.top, left: tooltip.left, width: TOOLTIP_WIDTH }}
        >
          <p className="mb-1 font-semibold">{tooltip.course.title}</p>
          <p className="leading-relaxed text-white/80">{tooltip.course.description}</p>
          <div className="mt-2 flex justify-between border-t border-white/20 pt-2 text-white/60">
            <span>{(TYPE_STYLES[tooltip.course.courseType] || TYPE_STYLES.CORE).label}</span>
            <span>{tooltip.course.units} units</span>
          </div>

          {tooltip.placement === "top" ? (
            <div className="absolute top-full -translate-x-1/2" style={{ left: tooltip.arrowLeft }}>
              <div className="border-4 border-transparent border-t-navy" />
            </div>
          ) : (
            <div className="absolute bottom-full -translate-x-1/2" style={{ left: tooltip.arrowLeft }}>
              <div className="border-4 border-transparent border-b-navy" />
            </div>
          )}
        </div>
      )}

      {/* Mobile: vertical summary */}
      <div className="md:hidden">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Course Summary</h3>
        <div className="space-y-2">
          {courses.map((course) => {
            const style = TYPE_STYLES[course.courseType] || TYPE_STYLES.CORE;
            return (
              <div key={course.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className={`w-2 h-2 rounded-full ${style.bg} flex-shrink-0`} />
                <span className="text-xs text-gray-400 font-mono w-16 flex-shrink-0">{course.code}</span>
                <span className="text-sm text-gray-800 flex-1">{course.title}</span>
                <span className="text-xs text-gray-400">Y{course.year}S{course.semester}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
