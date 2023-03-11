import { format, addDays, subDays } from "date-fns";

export const format_time = (date: Date) => {
  const today = new Date();
  const day = format(date, "yyyy-MM-dd");
  if (format(subDays(today, 1), "yyyy-MM-dd") === day) {
    return format(date, "'Yesterday', hh:mm aa");
  }
  if (format(today, "yyyy-MM-dd") === day) {
    return format(date, "'Today', hh:mm aa");
  }
  if (format(addDays(today, 1), "yyyy-MM-dd") === day) {
    return format(date, "'Tomorrow', hh:mm aa");
  }
  return format(date, "MMM dd, hh:mm aa");
};

export function countdown(targetDate: number): string {
  const timeLeft = targetDate - new Date().getTime();

  if (timeLeft <= 0) {
    return "Expired";
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const timeUnits = [];
  if (days > 0) {
    timeUnits.push(`${days} day${days > 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    timeUnits.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    timeUnits.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }
  if (seconds > 0) {
    timeUnits.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
  }

  return timeUnits.join(", ");
}
