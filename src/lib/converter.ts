export const convertBase = (value: string, fromBase: number, toBase: number): string => {
  if (!value) return '';
  try {
    // Handle invalid characters for the given base
    const validChars = getValidChars(fromBase);
    const regex = new RegExp(`^[${validChars}]+$`, 'i');
    if (!regex.test(value)) {
      return 'Invalid input for selected base';
    }

    const parsed = parseInt(value, fromBase);
    if (isNaN(parsed)) return 'Invalid input';
    return parsed.toString(toBase).toUpperCase();
  } catch (e) {
    return 'Error converting';
  }
};

const getValidChars = (base: number): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars.slice(0, base);
};
