export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const getPercent = (a: number, b: number) => ((a / b) * 100).toFixed(1);
