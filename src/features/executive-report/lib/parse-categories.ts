export function parseCategories(value?: string | null) {
  if (!value) {
    return ["Sem categoria"];
  }

  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
