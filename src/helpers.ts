export const emptyProgressEntry = () => ({
});

export function getLabelClasses(label: string) {
  switch (label) {
    case "warm-up": return "bg-[#fff3b0] text-black border-black";
    case "workout": return "bg-[#febdcd] text-black border-black";
    case "rest": return "bg-[#c8e3f4] text-black border-black";
    case "finisher": return "bg-black text-white border-black";
    case "stretch": return "bg-[#d9f7e6] text-black border-black";
    case "reset": return "bg-[#ece0ff] text-black border-black";
    case "mobility": return "bg-[#ffe2c7] text-black border-black";
    case "bonus": return "bg-[#ffd8ef] text-black border-black";
    default: return "bg-white text-black border-black";
  }
}

export function getDayDifference(startDateString: string) {
  if (!startDateString) return 0;
  const start = new Date(startDateString);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000) + 1);
}

export function getWeekNumber(startDateString: string) {
  const days = getDayDifference(startDateString);
  return days ? Math.ceil(days / 7) : 0;
}

export function getWeeklyPattern(weekNumber: number) {
  if (!weekNumber) return "Set your start date to begin tracking.";
  return weekNumber % 2 === 1
    ? "This week pattern: Day A / Day B / Day A"
    : "This week pattern: Day B / Day A / Day B";
}

export function getDayDifferenceFrom(entryDate: string, startDateString: string) {
  if (!startDateString) return 1;
  const start = new Date(startDateString);
  const date = new Date(entryDate);
  start.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((date.getTime() - start.getTime()) / 86400000) + 1);
}

export function summarizeDifficulty(values: string[]) {
  const rank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
  if (!values.length) return "No data";
  const avg = values.reduce((sum, val) => sum + (rank[val] || 2), 0) / values.length;
  if (avg < 1.5) return "Easy";
  if (avg < 2.5) return "Medium";
  return "Hard";
}

export function buildProgressSummary(entries: any[], startDate: string) {
  if (!entries.length) return "No progress entries yet.";
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const grouped: Record<number, any[]> = {};

  sorted.forEach((entry) => {
    const week = Math.max(1, Math.ceil(getDayDifferenceFrom(entry.date, startDate) / 7));
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(entry);
  });

  return Object.entries(grouped)
    .map(([week, weekEntries]) => {
      const pushupValues = weekEntries.map((e) => Number(e.pushupsMax)).filter((v) => !Number.isNaN(v) && v > 0);
      const firstPush = pushupValues.length ? pushupValues[0] : null;
      const lastPush = pushupValues.length ? pushupValues[pushupValues.length - 1] : null;
      const notes = weekEntries.map((e) => e.notes?.trim()).filter(Boolean).join(" | ");
      return `Week ${week}:\n\n* Workouts: ${weekEntries.length}\n* Push-ups: ${firstPush && lastPush ? `${firstPush} -> ${lastPush}` : "No data yet"}\n* Difficulty: ${summarizeDifficulty(weekEntries.map((e) => e.overallDifficulty))}\n* Notes: ${notes || "No notes yet"}`;
    })
    .join("\n\n");
}
