import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafeLinkedInUrl, normalizeAlumniInput, validateAlumniInput } from "@/lib/admin-validation";

export async function GET() {
  const alumni = await prisma.alumni.findMany({
    include: { program: { select: { title: true, slug: true } } },
    orderBy: [{ featured: "desc" }, { graduationYear: "desc" }],
  });
  return NextResponse.json(alumni);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const input = normalizeAlumniInput(body);
  const validationError = validateAlumniInput(input);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const alumni = await prisma.alumni.create({
    data: {
      name: input.name,
      role: input.role,
      company: input.company,
      graduationYear: input.graduationYear,
      bio: input.bio,
      testimonial: input.testimonial,
      featured: input.featured,
      linkedin: getSafeLinkedInUrl(input.linkedin),
      programId: input.programId || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/alumni");

  return NextResponse.json(alumni, { status: 201 });
}
