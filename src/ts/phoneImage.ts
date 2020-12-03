import { Phone } from "./types";
// NOTE: phone images are not "actively" imported. Because of this, they are placed in the public folder.

/**
 * The default value for phone width (in mm).
 */
export const DEFAULT_PHONE_WIDTH: number = 75;
/**
 * The default value for phone height (in mm).
 */
export const DEFAULT_PHONE_HEIGHT: number = 160;

/**
 * The default width of a phone image (in pixels)
 * @param props
 */
export const DEFAULT_PHONE_IMG_PIXEL_WIDTH: number = 45;

/**
 * The default height of a phone image (in pixels)
 * @param props
 */
export const DEFAULT_PHONE_IMG_PIXEL_HEIGHT: number = 90;

/**
 * Calculates the height of the image representing the phone (in pixels)
 * @param phone
 */
export function calcImgHeight(phone: Phone): number {
  let height = DEFAULT_PHONE_HEIGHT;
  if (phone.physical.height) {
    height = phone.physical.height;
  }
  return (height / DEFAULT_PHONE_HEIGHT) * DEFAULT_PHONE_IMG_PIXEL_HEIGHT;
}

/**
 * Calculates the height of the image representing the phone (in pixels)
 * @param phone
 */
export function calcImgWidth(phone: Phone): number {
  let width = DEFAULT_PHONE_WIDTH;
  if (phone.physical.width) {
    width = phone.physical.width;
  }
  return (width / DEFAULT_PHONE_WIDTH) * DEFAULT_PHONE_IMG_PIXEL_WIDTH;
}
