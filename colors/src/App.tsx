import React, { useEffect, useState } from 'react';
import './App.scss';
import * as wcagContrast from 'wcag-contrast';
import interpolator from 'natural-spline-interpolator';
import * as culori from 'culori';

function App() {
  const showContrastScores = true;

  // const chromaInterpolator = interpolator([[0, 0.25], [0.5, 0.4], [1, 0.25]]);
  const chromaInterpolator = interpolator([[0, 0.5], [0.5, 0.194], [1, 0.11]]); // [[0, 0.5], [0.5, 0.194], [1, 0.11]] is best so far

  const GOLDEN_RATIO = 1.618033988749;

  const [lightPalette, setLightPalette] = useState<any>(null);
  const [darkPalette, setDarkPalette] = useState<any>(null);

  const TOTAL_HUES = 12;
  const TOTAL_STEPS = 10;

  function calculateChroma(x: number, chroma1: number, chroma2: number): number {
    return chromaInterpolator(x);

    return 0.25 /*Math.max(0.25, 1
      - (chroma1 * x)
      - (chroma2 * (x ** 2)));*/
  }

  function calculateLightness(x: number, lightness1: number, lightness2: number, lightness3: number, lightness4: number, lightness5: number): number {
    return Math.max(0, 1
      // - (lightness1 * (x ** (1/2)))
      // - (lightness2 * (x ** (1/3)))
      // - (lightness3 * x)
      - (lightness2 * (x ** lightness3))
      - (lightness4 * (x ** lightness5))
      // - (lightness5 * (x ** 3))
    );

    // const lightnessInterpolator = interpolator([
    //   [0, 1],
    //   [lightness3, lightness1],
    //   [lightness4, lightness5],
    //   [1, lightness2]
    // ]);

    // return lightnessInterpolator(x);
  }

  function buildPalette({
    totalHues,
    totalSteps,
    hueOffset,
    lightness1,
    lightness2,
    lightness3,
    lightness4,
    lightness5,
    chroma1,
    chroma2
  }: {
    totalHues: any,
    totalSteps: any,
    hueOffset: any,
    lightness1: number,
    lightness2: number,
    lightness3: number,
    lightness4: number,
    lightness5: number,
    chroma1: number,
    chroma2: number
  }) {
    const hues = [];

    // Gray color
    const steps = [];

    for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
      const stepPercentage = stepIndex / totalSteps;
      const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4, lightness5);

      const h = 2 * Math.PI * 0.7;
      const chroma = calculateChroma(stepPercentage, chroma1, chroma2);
      const C = chroma * stepPercentage * 0.1;
      const a = C * Math.cos(h);
      const b = C * Math.sin(h);

      const color = culori.oklab({
        l: lightness,
        a: a,
        b: b,
      });

      steps.push({
        hex: culori.formatHex(color),
        darkContrast: 0,
        lightContrast: 0,
        whiteContrast: 0
      });
    }

    hues.push(steps);

    // Other colors
    for (let hueIndex = 0; hueIndex < totalHues; hueIndex++) {
      const steps = [];
      const huePercentage = hueIndex / totalHues;
      const h = 2 * Math.PI * huePercentage + hueOffset;

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        const stepPercentage = stepIndex / totalSteps;
        const chroma = calculateChroma(stepPercentage, chroma1, chroma2);
        const C = chroma * stepPercentage;
        const a = C * Math.cos(h/* - stepPercentage * 0.5*/);
        const b = C * Math.sin(h/* - stepPercentage * 0.5*/);
        const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4, lightness5);

        const color = culori.oklab({
          l: lightness,
          a,
          b
        });

        steps.push({
          hex: culori.formatHex(color),
          darkContrast: 0,
          lightContrast: 0,
          whiteContrast: 0
        });
      }

      hues.push(steps);
    }

    // Calculate contrast
    for (let hueIndex = 0; hueIndex < hues.length; hueIndex++) {
      const steps = hues[hueIndex];
      const lightestStep = steps[1];
      const darkestStep = steps[9];

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        const step = steps[stepIndex];

        step.darkContrast = wcagContrast.hex(darkestStep.hex, step.hex);
        step.lightContrast = wcagContrast.hex(lightestStep.hex, step.hex);
        step.whiteContrast = wcagContrast.hex('#ffffff', step.hex);
      }
    }

    return hues;
  }

  function getLightLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].lightContrast - targetContrast);
    }, 0);
  }

  function getWhiteLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].whiteContrast - targetContrast);
    }, 0);
  }

  function getAverageLightContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return contrast + steps[stepIndex].lightContrast;
    }, 0) / palette.length;
  }

  const [shouldSearch, setShouldSearch] = useState<boolean>(true);

  useEffect(() => {
    if (shouldSearch) {
      setShouldSearch(false);
      performLightPaletteSearch();
    }
  }, [shouldSearch]);

  function performLightPaletteSearch() {
    const startTimestamp = Date.now();

    let bestLightPalette;
    let bestLightLoss = Infinity;

    for (let ho = 0; ho <= 3; ho += 0.1) {
    // for (let l1 = 0; l1 <= 1; l1 += 0.1) {
      // for (let l2 = 0; l2 <= 1; l2 += 0.1) {
        // for (let l3 = 0; l3 <= 3; l3 += 0.1) {
          for (let l4 = 0; l4 <= 1; l4 += 0.05) {
            for (let l5 = 0; l5 <= 3; l5 += 0.05) {
        // for (let c1 = 0; c1 <= 1; c1 += 0.1) {
          // for (let c2 = 0; c2 <= 1; c2 += 0.1) {
            const lightPalette = buildPalette({
              totalHues: TOTAL_HUES,
              totalSteps: TOTAL_STEPS,
              hueOffset: ho,
              lightness1: 0,
              lightness2: 0,
              lightness3: 1,
              lightness4: l4,
              lightness5: l5,
              chroma1: 0,
              chroma2: 0
            });

            const targetContrast100 = 1.05;
            const targetContrast200 = getAverageLightContrast(lightPalette, 2);
            const targetContrast300 = getAverageLightContrast(lightPalette, 3);
            const targetContrast400 = getAverageLightContrast(lightPalette, 4);
            const targetContrast500 = getAverageLightContrast(lightPalette, 5);
            const targetContrast600 = getAverageLightContrast(lightPalette, 6);
            const targetContrast700 = 4.6;
            const targetContrast800 = getAverageLightContrast(lightPalette, 8);
            const targetContrast900 = /*targetContrast700 * GOLDEN_RATIO * GOLDEN_RATIO*/ 11;

            const loss100 = getWhiteLoss(lightPalette, 1, targetContrast100) * (targetContrast700 / targetContrast100);
            const loss200 = getLightLoss(lightPalette, 2, targetContrast200) * (targetContrast700 / targetContrast200) / 2;
            const loss300 = getLightLoss(lightPalette, 3, targetContrast300) * (targetContrast700 / targetContrast300) / 2;
            const loss400 = getLightLoss(lightPalette, 4, targetContrast400) * (targetContrast700 / targetContrast400) / 2;
            const loss500 = getLightLoss(lightPalette, 5, targetContrast500) * (targetContrast700 / targetContrast500) / 2;
            const loss600 = getLightLoss(lightPalette, 6, targetContrast600) * (targetContrast700 / targetContrast600) / 2;
            const loss700 = getLightLoss(lightPalette, 7, targetContrast700) * 1000;
            const loss800 = getLightLoss(lightPalette, 8, targetContrast800) * (targetContrast700 / targetContrast800) / 2;
            const loss900 = getLightLoss(lightPalette, 9, targetContrast900) * (targetContrast700 / targetContrast900);

            const lightLoss = 0
              + loss100
              + loss200
              + loss300
              + loss400
              + loss500
              + loss600
              + loss700
              + loss800
              + loss900;

            if (lightLoss < bestLightLoss) {
              bestLightPalette = lightPalette;
              bestLightLoss = lightLoss;

              // console.log('loss100', loss100);
              // console.log('loss700', loss700);
              // console.log('bestLightLoss updated', bestLightLoss);
            }
          }
        }
          // }
      // }
    // }
    }
    
    const endTimestamp = Date.now();

    console.log('Time taken: ', (endTimestamp - startTimestamp), 'ms');

    setLightPalette(bestLightPalette);
    setDarkPalette(bestLightPalette);

    console.log('bestLightLoss', bestLightLoss);
  }

  return (
    <div className="App">
      {(lightPalette && darkPalette) ? (
        <div className="modes">
          <div className="mode mode-light"
            style={{
              background: lightPalette[0][1].hex,
              color: lightPalette[0][9].hex
            }}>
            <div className="colors">
              {lightPalette[0].map(
                (step: any, stepIndex: number) =>
                  <div key={stepIndex} className="color-step">
                    {(stepIndex === 0)
                      ? null
                      : stepIndex * 100}
                  </div>
              )}

              {lightPalette.map(
                (steps: any, hueIndex: number) =>
                  steps.map(
                    (step: any, stepIndex: number) =>
                      <div
                        key={`${hueIndex}-${stepIndex}`}
                        className="color"
                        style={{ background: step.hex }}>
                        {(showContrastScores) ? (<div className={[
                          'color-contrast',
                          (
                            (stepIndex === 7 && step.lightContrast >= 4.5 && step.lightContrast <= 7) ||
                            (stepIndex === 8 && step.lightContrast >= 7 && step.lightContrast <= 11) ||
                            (stepIndex === 9 && step.lightContrast >= 11 && step.lightContrast <= 15)
                          )
                            ? 'color-contrast-satisfying'
                            : ''
                        ].join(' ')}>{step.lightContrast.toFixed(2)}</div>) : null}
                      </div>
                  )
              )}
            </div>
          </div>
          <div className="mode mode-dark"
            style={{
              background: darkPalette[0][9].hex,
              color: darkPalette[0][1].hex
            }}>
            <div className="colors">
              {darkPalette[0].map(
                (step: any, stepIndex: number) =>
                  <div key={stepIndex} className="color-step">
                    {(stepIndex === 0)
                      ? null
                      : stepIndex * 100}
                  </div>
              )}

              {darkPalette.map(
                (steps: any, hueIndex: number) =>
                  steps.map(
                    (step: any, stepIndex: number) =>
                      <div
                        key={`${hueIndex}-${stepIndex}`}
                        className="color"
                        style={{ background: step.hex }}>
                        {(showContrastScores) ? (<div className={[
                          'color-contrast',
                          (
                            (stepIndex === 3 && step.darkContrast >= 4.5 && step.darkContrast <= 7) ||
                            (stepIndex === 2 && step.darkContrast >= 7 && step.darkContrast <= 11) ||
                            (stepIndex === 1 && step.darkContrast >= 11 && step.darkContrast <= 15)
                          )
                            ? 'color-contrast-satisfying'
                            : ''
                        ].join(' ')}>{step.darkContrast.toFixed(2)}</div>) : null}
                      </div>
                  )
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
