"use strict";
exports.__esModule = true;
var wcag_contrast_1 = require("wcag-contrast");
console.log(wcag_contrast_1["default"]);
var TOTAL_HUES = 12;
var TOTAL_STEPS = 10;
var HUE_OFFSET = 0;
var MAX_CHROMA = 0.25;
var LIGHTNESS = 1;
var COLOR_BOX_WIDTH = 100;
var COLOR_BOX_HEIGHT = 80;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var colorsMatrix = buildColorsMatrix({
    totalHues: TOTAL_HUES,
    totalSteps: TOTAL_STEPS,
    hueOffset: HUE_OFFSET,
    maxChroma: MAX_CHROMA
});
drawColorsMatrix({
    colorsMatrix: colorsMatrix,
    colorBoxWidth: COLOR_BOX_WIDTH,
    colorBoxHeight: COLOR_BOX_HEIGHT
});
function buildColorsMatrix(_a) {
    var totalHues = _a.totalHues, totalSteps = _a.totalSteps, hueOffset = _a.hueOffset, maxChroma = _a.maxChroma;
    var hues = [];
    for (var hueIndex = 0; hueIndex < totalHues; hueIndex++) {
        var steps = [];
        var huePercentage = hueIndex / totalHues;
        var h = 2 * Math.PI * huePercentage + hueOffset;
        for (var stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
            var stepPercentage = stepIndex / totalSteps;
            var C = maxChroma * stepPercentage;
            var a = C * Math.cos(h);
            var b = C * Math.sin(h);
            var lightness = 1 - 0.8 * stepPercentage * stepPercentage;
            steps.push(oklabToRgb([lightness, a, b]));
        }
        hues.push(steps);
    }
    return hues;
}
function drawColorsMatrix(_a) {
    var colorsMatrix = _a.colorsMatrix, colorBoxWidth = _a.colorBoxWidth, colorBoxHeight = _a.colorBoxHeight;
    for (var hueIndex = 0; hueIndex < colorsMatrix.length; hueIndex++) {
        var steps = colorsMatrix[hueIndex];
        for (var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            var _b = steps[stepIndex], r = _b[0], g = _b[1], b = _b[2];
            var x = hueIndex * colorBoxWidth;
            var y = stepIndex * colorBoxHeight;
            var width = colorBoxWidth;
            var height = colorBoxHeight;
            ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
            ctx.fillRect(x, y, width, height);
            // const contrast = 
        }
    }
}
function oklabToRgb(_a) {
    var L = _a[0], a = _a[1], b = _a[2];
    var l = Math.pow((L + 0.3963377774 * a + 0.2158037573 * b), 3);
    var m = Math.pow((L - 0.1055613458 * a - 0.0638541728 * b), 3);
    var s = Math.pow((L - 0.0894841775 * a - 1.291485548 * b), 3);
    return [
        clamp(255 * gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
        clamp(255 * gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
        clamp(255 * gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))
    ];
}
function gamma(x) {
    return (x >= 0.0031308)
        ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055
        : 12.92 * x;
}
function clamp(n) {
    return Math.min(Math.max(0, Math.round(n)), 255);
}
