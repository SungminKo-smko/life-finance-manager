import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.insurancePolicy.update({
    where: { id: params.id },
    data: {
      insurer: body.insurer,
      productName: body.productName,
      insuranceType: body.insuranceType,
      purpose: body.purpose,
      monthlyPremium: body.monthlyPremium,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      status: body.status,
      memo: body.memo
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.insurancePolicy.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
