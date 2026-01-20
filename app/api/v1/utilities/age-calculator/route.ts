import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { birthDate, targetDate = new Date() } = await req.json();

    const birth = new Date(birthDate);
    const today = new Date(targetDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Additional stats for the API
    const totalDays = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalWeeks = Math.floor(totalDays / 7);

    return NextResponse.json({
      status: "success",
      data: {
        years,
        months,
        days,
        total_days: totalDays,
        total_weeks: totalWeeks,
        next_birthday_days: 0, // Logic for next bday can be added here
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid date provided" },
      { status: 400 },
    );
  }
}
