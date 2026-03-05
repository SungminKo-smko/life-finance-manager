import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest) {
  return req.nextUrl.searchParams.get("userId") ?? "demo-user";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);

  if (userId === "demo-user") {
    return NextResponse.json({
      targetRetireAge: 55,
      currentAge: 35,
      monthlyGap: 800000,
      suggestions: [
        "변동지출(식비/여가)에서 월 30만원 절감하십시오.",
        "저축·투자 자동이체를 월 50만원 추가 설정하십시오.",
        "보험 중복 보장을 점검해 월 보험료 10만원 절감 가능성을 확인하십시오."
      ]
    });
  }

  const profile = await prisma.retirementProfile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "retirement profile not found" }, { status: 404 });
  }

  const month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [income, expense, invest, save, insurance, expenseRows] = await Promise.all([
    prisma.incomeRecord.aggregate({ where: { userId, month }, _sum: { amount: true } }),
    prisma.expenseRecord.aggregate({ where: { userId, month }, _sum: { amount: true } }),
    prisma.investmentRecord.aggregate({ where: { userId, month }, _sum: { amount: true } }),
    prisma.savingRecord.aggregate({ where: { userId, month }, _sum: { amount: true } }),
    prisma.insurancePolicy.aggregate({ where: { userId, status: "ACTIVE" }, _sum: { monthlyPremium: true } }),
    prisma.expenseRecord.findMany({ where: { userId, month } })
  ]);

  const monthlySurplus =
    Number(income._sum.amount ?? 0) - Number(expense._sum.amount ?? 0) - Number(insurance._sum.monthlyPremium ?? 0);

  const needed = Number(profile.targetMonthlyLivingCost) * 12 / (Number(profile.safeWithdrawalRate) / 100);
  const current = Number(profile.currentNetWorth ?? 0);
  const yearsLeft = Math.max(profile.targetRetireAge - profile.currentAge, 1);
  const monthlyNeed = Math.max((needed - current) / (yearsLeft * 12), 0);
  const monthlyGap = Math.max(monthlyNeed - (Number(invest._sum.amount ?? 0) + Number(save._sum.amount ?? 0)), 0);

  const suggestions: string[] = [];
  const totalExpense = Number(expense._sum.amount ?? 0);
  const topExpense = expenseRows
    .reduce((map, r) => {
      const key = String(r.subCategory);
      map.set(key, (map.get(key) ?? 0) + Number(r.amount));
      return map;
    }, new Map<string, number>());
  const top = Array.from(topExpense.entries()).sort((a, b) => b[1] - a[1])[0];

  if (monthlyGap > 0) {
    suggestions.push(`월 ${Math.round(monthlyGap).toLocaleString("ko-KR")}원을 추가 확보하십시오.`);
  }
  if (top) {
    const cut = Math.round(top[1] * 0.1);
    suggestions.push(`${top[0]} 지출을 먼저 점검하고 월 ${cut.toLocaleString("ko-KR")}원 절감을 시도하십시오.`);
  }
  if (totalExpense > 0) {
    const investUp = Math.round(totalExpense * 0.05);
    suggestions.push(`저축·투자 자동이체를 월 ${investUp.toLocaleString("ko-KR")}원 추가하십시오.`);
  }
  suggestions.push("보험은 중복 보장 여부를 확인해 불필요한 항목을 줄이십시오.");

  return NextResponse.json({
    targetRetireAge: profile.targetRetireAge,
    currentAge: profile.currentAge,
    monthlyGap,
    monthlyNeed,
    monthlySurplus,
    suggestions
  });
}
