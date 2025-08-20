function formatIntoSpace(
  text: string | number,
  groups: number,
  separator = " ",
): string {
  const textStr = text.toString();
  const regex = new RegExp(`(\\d{${groups}})(?!$)`, "g");
  return textStr.replace(regex, `$1${separator}`);
}

export { formatIntoSpace };
