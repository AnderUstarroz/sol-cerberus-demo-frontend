export function human_number(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: decimals,
  });
}
