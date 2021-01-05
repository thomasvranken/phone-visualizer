import { Phone } from "./types";

/**
 * Returns a string containing the brand and name of the phone.
 * @param phone
 */
export function getFullName(phone: Phone): string {
  return phone.brand + " " + phone.name;
}

/**
 * Returns a sorting value based on the full name of the
 * two given phones.
 * @param a
 * @param b
 */
export function compPhoneName(a: Phone, b: Phone): number {
  if (getFullName(a) > getFullName(b)) return 1;
  else if (getFullName(a) < getFullName(b)) return -1;
  else return 0;
}
