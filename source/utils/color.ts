export function rgbToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const linearR = gammaInverse(r / 255);
  const linearG = gammaInverse(g / 255);
  const linearB = gammaInverse(b / 255);

  const l = Math.cbrt(0.4122214708 * linearR + 0.5363325363 * linearG + 0.0514459929 * linearB);
  const m = Math.cbrt(0.2119034982 * linearR + 0.6806995451 * linearG + 0.1073969566 * linearB);
  const s = Math.cbrt(0.0883024619 * linearR + 0.2817188376 * linearG + 0.6299787005 * linearB);

  return [
    l * 0.2104542553 + m * 0.793617785 + s * -0.0040720468,
    l * 1.9779984951 + m * -2.428592205 + s * 0.4505937099,
    l * 0.0259040371 + m * 0.7827717662 + s * -0.808675766
  ];
};

export function oklabToRgb([L, a, b]: [number, number, number]): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    clamp(255 * gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    clamp(255 * gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    clamp(255 * gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))
  ];
};

function gamma(x: number): number {
  return (x >= 0.0031308)
    ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055
    : 12.92 * x;
}

function gammaInverse(x: number): number {
  return (x >= 0.04045)
    ? Math.pow((x + 0.055) / (1 + 0.055), 2.4)
    : x / 12.92;
}

function clamp(n: number): number {
  return Math.min(Math.max(0, Math.round(n)), 255);
}
