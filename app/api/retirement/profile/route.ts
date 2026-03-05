import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest) {
  return req.nextUrl.searchParams.get("userId") ?? "demo-user";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();

  if (userId === "demo-user") {
    return NextResponse.json({ ok: true, demo: true });
  }

  const row = await prisma.retirementProfile.upsert({
    where: { userId },
    update: {
      currentAge: Number(body.currentAge),
      targetRetireAge: Number(body.targetRetireAge),
      targetMonthlyLivingCost: Number(body.targetMonthlyLivingCost)
    },
    create: {
      userId,
      currentAge: Number(body.currentAge),
      targetRetireAge: Number(body.targetRetireAge),
      targetMonthlyLivingCost: Number(body.targetMonthlyLivingCost),
      expectedReturnRate: 5,
      inflationRate: 2.5,
      safeWithdrawalRate: 4
    }
  });

  return NextResponse.json(row);
}
