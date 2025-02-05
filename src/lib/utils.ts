export const addPTag = (s: string) =>
  s
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

export const removePTag = (s: string) =>
  s.replace(/<p>/g, "").replace(/<\/p>/g, "\n");
