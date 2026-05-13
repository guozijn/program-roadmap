import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafeExternalUrl, normalizePartnerInput, validatePartnerInput } from "@/lib/admin-validation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const input = normalizePartnerInput(body);
  const validationError = validatePartnerInput(input);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const partner = await prisma.industryPartner.update({
    where: { id: params.id },
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

  return NextResponse.json(partner);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.industryPartner.delete({ where: { id: params.id } });

  revalidatePath("/");
  revalidatePath("/industry");

  return NextResponse.json({ success: true });
}
