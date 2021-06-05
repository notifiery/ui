import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { rgb } from 'wcag-contrast';

export default function Home() {
  if (process.browser) {
    const hueOffsets = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];

    const TOTAL_HUES = 12;
    const TOTAL_STEPS = 11;
    // const HUE_OFFSET = 0;
    const MAX_CHROMA = 0.25;
    // const LIGHTNESS = 1;
    
    const COLOR_BOX_WIDTH = 100;
    const COLOR_BOX_HEIGHT = 80;
    
    const canvas = window.document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    // const colorsMatrix = buildColorsMatrix({
    //   totalHues: TOTAL_HUES,
    //   totalSteps: TOTAL_STEPS,
    //   hueOffset: HUE_OFFSET,
    //   maxChroma: MAX_CHROMA
    // });

    let bestAverageContrast600 = -Infinity;
    let bestColorsMatrix;

    let worstAverageContrast600 = Infinity;
    let worstColorsMatrix;

    for (let hueOffset = 0; hueOffset < 0.01; hueOffset += 0.01) {
      const colorsMatrix = buildColorsMatrix({
        totalHues: TOTAL_HUES,
        totalSteps: TOTAL_STEPS,
        hueOffsets,
        hueOffset,
        maxChroma: MAX_CHROMA
      });

      const averageContrast600 = calculateAverageContrast600(colorsMatrix);

      if (averageContrast600 > bestAverageContrast600) {
        bestAverageContrast600 = averageContrast600;
        bestColorsMatrix = colorsMatrix;
      }

      if (averageContrast600 < worstAverageContrast600) {
        worstAverageContrast600 = averageContrast600;
        worstColorsMatrix = colorsMatrix;
      }
    }

    console.log('bestAverageContrast600', bestAverageContrast600);
    console.log('bestColorsMatrix', bestColorsMatrix);

    console.log('worstAverageContrast600', worstAverageContrast600);
    console.log('worstColorsMatrix', worstColorsMatrix);

    drawColorsMatrix({
      colorsMatrix: bestColorsMatrix,
      colorBoxWidth: COLOR_BOX_WIDTH,
      colorBoxHeight: COLOR_BOX_HEIGHT
    });

    function buildColorsMatrix({ totalHues, totalSteps, hueOffsets, hueOffset, maxChroma }) {
      const hues = [];
    
      for (let hueIndex = 0; hueIndex < totalHues; hueIndex++) {
        const steps = [];
        const huePercentage = hueIndex / totalHues;
        const h = 2 * Math.PI * huePercentage + hueOffset + hueOffsets[hueIndex];
    
        for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
          const stepPercentage = stepIndex / totalSteps;
          const C = maxChroma * stepPercentage;
          const a = C * Math.cos(h);
          const b = C * Math.sin(h);
          const lightness = 1 - (0.5 * (stepPercentage ** 2)) - (0.25 * (stepPercentage ** 3));
    
          steps.push(oklabToRgb([lightness, a, b]));
        }
    
        hues.push(steps);
      }
    
      return hues;
    }
    
    function drawColorsMatrix({ colorsMatrix, colorBoxWidth, colorBoxHeight }) {
      for (let hueIndex = 0; hueIndex < colorsMatrix.length; hueIndex++) {
        const steps = colorsMatrix[hueIndex];
    
        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
          const [r, g, b] = steps[stepIndex];
          const x = hueIndex * colorBoxWidth;
          const y = stepIndex * colorBoxHeight;
          const width = colorBoxWidth;
          const height = colorBoxHeight;
    
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, width, height);
    
          const blackContrast = rgb([0, 0, 0], [r, g, b]);
          const whiteContrast = rgb([255, 255, 255], [r, g, b]);

          ctx.font = "24px Arial";
          ctx.fillStyle = '#000';
          ctx.fillText(blackContrast.toFixed(2), x + 24, y + 36);
          
          ctx.fillStyle = '#fff';
          ctx.fillText(whiteContrast.toFixed(2), x + 24, y + 36 + 24);
        }
      }

      for (let stepIndex = 0; stepIndex < colorsMatrix[0].length; stepIndex++) {
        if (stepIndex === 0) {
          continue;
        }

        const weight = (stepIndex === 1)
          ? 50
          : (stepIndex - 1) * 100;

        ctx.fillStyle = '#000';
        ctx.fillText(weight, colorsMatrix.length * colorBoxWidth + 24, stepIndex * colorBoxHeight + 36);
      }
    }

    function calculateAverageContrast600(colorsMatrix) {
      return colorsMatrix.reduce((sum, hue) => {
        const [r, g, b] = hue[6];

        // const blackContrast = rgb([0, 0, 0], [r, g, b]);
        const whiteContrast = rgb([255, 255, 255], [r, g, b]);

        return sum + whiteContrast;
      }, 0) / colorsMatrix.length;
    }
    
    function oklabToRgb([L, a, b]) {
      const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
      const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
      const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    
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
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <canvas id="canvas" width="1300" height="1200" style={{ width: '1300px', height: '1200px' }}></canvas>
      </main>
    </div>
  )
}
