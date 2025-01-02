export function removeFromObj(obj: Record<string, any>, toRemove: string[]) {
  const result = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !toRemove.includes(key)),
  );
  return result;
}

export function getFromObj(obj: Record<string, any>, toGet: string[]) {
  const result = Object.fromEntries(
    Object.entries(obj).filter(([key]) => toGet.includes(key)),
  );

  return result;
}
