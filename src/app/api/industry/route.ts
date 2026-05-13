import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafeExternalUrl, normalizePartnerInput, validatePartnerInput } from "@/lib/admin-validation";

export async function GET() {
  const partners = await prisma.industryPartner.findMany({ orderBy: [{ tier: "asc" }, { name: "asc" }] });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const input = normalizePartnerInput(body);
  const validationError = validatePartnerInput(input);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const partner = await prisma.industryPartner.create({
    data: {
      name: input.name,
      description: input.description,
      website: getSafeExternalUrl(input.website),
      category: input.category,
      tier: input.tier,
      published: input.published,
    },
  });

  revalidatePath("/");
  revalidatePath("/industry");

  return NextResponse.json(partner, { status: 201 });
}
