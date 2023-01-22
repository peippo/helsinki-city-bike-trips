export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const getPercent = (a: number, b: number) => ((a / b) * 100).toFixed(1);

export const getKilometers = (a: number, b: number) =>
  Math.round((a / b / 1000) * 1e2) / 1e2;

export const getMinutes = (a: number, b: number) => Math.round(a / b / 60);
