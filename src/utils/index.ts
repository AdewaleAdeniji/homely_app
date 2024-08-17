import { v4 as uuidv4 } from 'uuid';

export function getContrastColor(hexColor: string): string {
  // Convert hex color to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds and black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgb(hexColor: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!result) {
    throw new Error("Invalid hex color format");
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

export function computeColors(hexColor: string): {
  color: string;
  background: string;
  darker: string;
  darkerHexColor: string;
} {
  const contrastColor = getContrastColor(hexColor);
  const [r, g, b] = hexToRgb(hexColor);
  const darkerR = Math.floor(r * 0.8); // Adjust the factor for desired darkness
  const darkerG = Math.floor(g * 0.8);
  const darkerB = Math.floor(b * 0.8);
  const darkerHexColor = rgbToHex(darkerR, darkerG, darkerB);

  return {
    color: contrastColor,
    background: hexColor,
    darker: `rgb(${darkerR}, ${darkerG}, ${darkerB}, 1)`,
    darkerHexColor,
  };
}
export const  getUniqueItems = (array: []) => {
  // Create a Set from the array to automatically remove duplicates
  const uniqueItemsSet = new Set(array);
  // Convert the Set back to an array
  const uniqueItemsArray = Array.from(uniqueItemsSet);
  return uniqueItemsArray;
}

export const generateID = (prefix = "") => {
  const timestamp = new Date().getTime().toString(); // get current timestamp as string
  const random = Math.random().toString().substr(2, 5); // generate a random string of length 5
  const userId = timestamp + random; // concatenate the timestamp and random strings
  return prefix + generateRandomString(7) + userId + generateRandomString(5);
};
export const generateRandomString = (length = 7) => {
  const uuid =  uuidv4();
  return uuid.substr(0, length);
};
export const vibrate = (duration: number) => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(duration);
  }
}