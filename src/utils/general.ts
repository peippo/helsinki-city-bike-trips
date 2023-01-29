export const getPercent = (a: number, b: number) => ((a / b) * 100).toFixed(1);

export const formatDistance = (meters: number) =>
  meters < 1000
    ? `${meters} m`
    : `${Math.round((meters / 1000) * 1e2) / 1e2} km`;

export const getAvgKilometers = (totalMeters: number, count: number) =>
  Math.round((totalMeters / count / 1000) * 1e2) / 1e2;

export const getAvgMinutes = (totalSeconds: number, count: number) =>
  Math.round(totalSeconds / count / 60);

export const formatDuration = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const strings = {
    day: d > 0 ? (d > 1 ? `${d} days ` : `${d} day `) : "",
    h: h > 0 ? `${h} h ` : "",
    min: min > 0 ? `${min} min ` : "",
    s: s > 0 ? `${s} s ` : "",
  };

  return `${strings.day}${strings.h}${strings.min}${strings.s}`.trim();
};

export const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hourCycle: "h23",
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
