
export const DAY_MS = 86_400_000;

export const startOfDay = (d: Date | number) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addDays = (d: Date | number, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const sameDay = (a: Date | number, b: Date | number) => startOfDay(a).getTime() === startOfDay(b).getTime();
export const dateKey = (d: Date | number) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
export const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};
export const weekStart = (d: Date | number) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};
export const minutesOfDay = (d: Date | number) => {
  const x = new Date(d);
  return x.getHours() * 60 + x.getMinutes();
};
export const atMinutes = (day: Date | number, minutes: number) => {
  const x = startOfDay(day);
  x.setMinutes(minutes);
  return x;
};

export const formatTime = (d: Date | number) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
export const formatMinutes = (m: number) => formatTime(atMinutes(new Date(), m));
export const formatRange = (start: number, durationMin: number) => `${formatTime(start)} – ${formatTime(start + durationMin * 60_000)}`;
export const formatLongDate = (d: Date | number) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export function relativeDay(d: Date | number, now = Date.now()) {
  const diff = Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / DAY_MS);
  const prefix = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : diff === -1 ? "Yesterday" : new Date(d).toLocaleDateString("en-US", { weekday: "short" });
  return `${prefix}, ${formatLongDate(d)}`;
}

export function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
