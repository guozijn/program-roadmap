import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

async function saveSettings(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updates = Array.isArray(body) ? body : [body];

  const results = await Promise.all(
    updates.map(({ key, value }: { key: string; value: string }) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/alumni");
  revalidatePath("/industry");

  return NextResponse.json(results);
}

export async function PUT(req: NextRequest) {
  return saveSettings(req);
}

export async function POST(req: NextRequest) {
  return saveSettings(req);
}
