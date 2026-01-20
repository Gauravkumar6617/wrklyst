import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // We remove the VALID_API_KEYS check here to make it FREE
    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Please provide both dates" },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total days
    const diffInMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Breakdown logic (Years, Months, Days)
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return NextResponse.json({
      status: "success",
      source: "Wrklyst Free Utilities",
      data: {
        total_days: totalDays,
        total_weeks: (totalDays / 7).toFixed(1),
        breakdown: { years, months, days },
        total_hours: totalDays * 24,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }
}
