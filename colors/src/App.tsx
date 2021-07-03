import React, { useEffect, useState } from 'react';
import './App.scss';
import * as wcagContrast from 'wcag-contrast';
import ReactSlider from 'react-slider';
import interpolator from 'natural-spline-interpolator';
import * as culori from 'culori';

function App() {
  const TARGET_BACKGROUND_CONTRAST = 1.15;
  const TARGET_LABEL_CONTRAST = 3;
  const TARGET_PRIMARY_CONTRAST = 4.5;
  const TARGET_STRONG_PRIMARY_CONTRAST = 7;
  const TARGET_STRONGEST_PRIMARY_CONTRAST = 11;

  const showContrastScores = true;

  const lightChromaInterpolator = interpolator([[0, 0.5], [0.5, 0.25], [1, 0.075]]);
  const darkChromaInterpolator = interpolator([[0, 1], [0.5, 0.25], [1, 0.075]]);

  const GOLDEN_RATIO = 1.618033988749;

  const [lightPalette, setLightPalette] = useState<any>(null);
  const [darkPalette, setDarkPalette] = useState<any>(null);

  const [hueOffset, setHueOffset] = useState<any>(0);
  const [lightness1, setLightness1] = useState<any>(0);
  const [lightness2, setLightness2] = useState<any>(0);
  const [lightness3, setLightness3] = useState<any>(0);
  const [lightness4, setLightness4] = useState<any>(0);

  const TOTAL_HUES = 12;
  const TOTAL_STEPS = 10;

  // Light palette:
  // Background (cards, buttons, select boxes, tags, etc.)
  // Body
  // Disabled
  // Label
  // Primary (text, small title)
  // Strong primary (blog post text, medium title)
  // Strongest primary (large title)
  // Focus
  // Hover
  // Active
  // Selected


  // Element background
  // Hover background (for buttons, and various elements)
  // Disabled state
  //

  function calculateChroma(x: number, isLight: boolean): number {
    return (isLight)
      ? lightChromaInterpolator(x)
      : darkChromaInterpolator(x);
  }

  function calculateLightness(x: number, lightness1: number, lightness2: number, lightness3: number, lightness4: number): number {
    return Math.max(0, 1
      - (lightness1 * (x ** lightness2))
      - (lightness3 * (x ** lightness4))
    );
  }

  function buildPalette({
    isLight,
    totalHues,
    totalSteps,
    hueOffset,
    lightness1,
    lightness2,
    lightness3,
    lightness4
  }: {
    isLight: boolean,
    totalHues: any,
    totalSteps: any,
    hueOffset: any,
    lightness1: number,
    lightness2: number,
    lightness3: number,
    lightness4: number
  }) {
    const hues = [];

    // Gray color
    const steps = [];

    for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
      const stepPercentage = stepIndex / totalSteps;
      const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4);

      const h = 2 * Math.PI * 0.7;
      const chroma = calculateChroma(stepPercentage, isLight);
      const C = chroma * stepPercentage * 0.2;
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
        whiteContrast: 0,
        blackContrast: 0
      });
    }

    steps.push({
      hex: '#000000',
      darkContrast: 0,
      lightContrast: 0,
      whiteContrast: 0,
      blackContrast: 0
    });

    hues.push(steps);

    // Other colors
    for (let hueIndex = 0; hueIndex < totalHues; hueIndex++) {
      const steps = [];
      const huePercentage = hueIndex / totalHues;
      const h = 2 * Math.PI * huePercentage + hueOffset;

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        const stepPercentage = stepIndex / totalSteps;
        const chroma = calculateChroma(stepPercentage, isLight);
        const C = chroma * stepPercentage;
        const a = C * Math.cos(h/* - stepPercentage * degreesToRadians(7)*/);
        const b = C * Math.sin(h/* - stepPercentage * degreesToRadians(7)*/);
        const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4);

        const color = culori.oklab({
          l: lightness,
          a,
          b
        });

        steps.push({
          hex: culori.formatHex(color),
          darkContrast: 0,
          lightContrast: 0,
          whiteContrast: 0,
          blackContrast: 0
        });
      }

      steps.push({
        hex: '#000000',
        darkContrast: 0,
        lightContrast: 0,
        whiteContrast: 0,
        blackContrast: 0
      });

      hues.push(steps);
    }

    // Calculate contrast
    for (let hueIndex = 0; hueIndex < hues.length; hueIndex++) {
      const steps = hues[hueIndex];
      const lightestStep = steps[1];
      const darkestStep = steps[9];

      for (let stepIndex = 0; stepIndex < totalSteps + 1; stepIndex++) {
        const step = steps[stepIndex];

        step.darkContrast = wcagContrast.hex(darkestStep.hex, step.hex);
        step.lightContrast = wcagContrast.hex(lightestStep.hex, step.hex);
        step.whiteContrast = wcagContrast.hex('#ffffff', step.hex);
        step.blackContrast = wcagContrast.hex('#000000', step.hex);
      }
    }

    return hues;
  }

  function getLightLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].lightContrast - targetContrast);
    }, 0);
  }

  function getDarkLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].darkContrast - targetContrast);
    }, 0);
  }

  function getWhiteLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].whiteContrast - targetContrast);
    }, 0);
  }

  function getBlackLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].blackContrast - targetContrast);
    }, 0);
  }

  function getAverageLightContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return contrast + steps[stepIndex].lightContrast;
    }, 0) / palette.length;
  }

  function getAverageDarkContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return contrast + steps[stepIndex].darkContrast;
    }, 0) / palette.length;
  }

  function getMinLightContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.min(contrast, steps[stepIndex].lightContrast);
    }, Infinity);
  }

  function getMinDarkContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.min(contrast, steps[stepIndex].darkContrast);
    }, Infinity);
  }

  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const [isSearchCompleted, setIsSearchCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (shouldSearch) {
      setShouldSearch(false);
      performLightPaletteSearch();
      performDarkPaletteSearch();
      setIsSearchCompleted(true);
    }
  }, [shouldSearch]);

  // useEffect(() => {
  //   if (isSearchCompleted) {
  //     const lightPalette = buildPalette({
  //       isLight: true,
  //       totalHues: TOTAL_HUES,
  //       totalSteps: TOTAL_STEPS,
  //       hueOffset: hueOffset,
  //       lightness1: lightness1,
  //       lightness2: lightness2,
  //       lightness3: 0,
  //       lightness4: 1
  //     });

  //     const darkPalette = buildPalette({
  //       isLight: false,
  //       totalHues: TOTAL_HUES,
  //       totalSteps: TOTAL_STEPS,
  //       hueOffset: hueOffset,
  //       lightness1: lightness3,
  //       lightness2: lightness4,
  //       lightness3: 0,
  //       lightness4: 1
  //     });

  //     setLightPalette(lightPalette);
  //     setDarkPalette(darkPalette);
  //   }
  // }, [hueOffset, lightness1, lightness2, lightness3, lightness4, isSearchCompleted]);

  function performLightPaletteSearch() {
    const startTimestamp = Date.now();

    let bestPalette;
    let bestLoss = Infinity;

    const ho = 3.762;

    // for (let ho = 0; ho <= 2 * Math.PI / TOTAL_HUES; ho += degreesToRadians(1)) {
      for (let l1 = 0; l1 <= 1; l1 += 0.1) {
        for (let l2 = 0; l2 <= 3; l2 += 0.1) {
          // for (let l3 = 0; l3 <= 1; l3 += 0.1) {
            // for (let l4 = 0; l4 <= 3; l4 += 0.1) {
              // for (let l5 = 0; l5 <= 3; l5 += 0.05) {
                const palette = buildPalette({
                  isLight: true,
                  totalHues: TOTAL_HUES,
                  totalSteps: TOTAL_STEPS,
                  hueOffset: ho,
                  lightness1: l1,
                  lightness2: l2,
                  lightness3: 0,
                  lightness4: 1
                });

                const minContrastLabel = getMinLightContrast(palette, 6);
                if (minContrastLabel < TARGET_LABEL_CONTRAST) {
                  continue;
                }

                const minContrastPrimary = getMinLightContrast(palette, 7);
                if (minContrastPrimary < TARGET_PRIMARY_CONTRAST) {
                  continue;
                }

                const minContrastStrongPrimary = getMinLightContrast(palette, 8);
                if (minContrastStrongPrimary < TARGET_STRONG_PRIMARY_CONTRAST) {
                  continue;
                }

                const minContrastStrongestPrimary = getMinLightContrast(palette, 9);
                if (minContrastStrongestPrimary < TARGET_STRONGEST_PRIMARY_CONTRAST) {
                  continue;
                }

                const targetContrastBackground = TARGET_BACKGROUND_CONTRAST;
                // const targetContrast200 = getAverageLightContrast(palette, 2);
                // const targetContrast300 = getAverageLightContrast(palette, 3);
                // const targetContrast400 = getAverageLightContrast(palette, 4);
                // const targetContrast500 = getAverageLightContrast(palette, 5);
                // const targetContrast600 = getAverageLightContrast(palette, 6);
                const targetContrastPrimary = TARGET_PRIMARY_CONTRAST;
                // const targetContrast800 = getAverageLightContrast(palette, 8);
                const targetContrastStrongestPrimary = TARGET_STRONGEST_PRIMARY_CONTRAST;

                const loss = 0
                  + getWhiteLoss(palette, 1, targetContrastBackground) * (targetContrastPrimary / targetContrastBackground)
                  // + getLightLoss(palette, 2, targetContrast200) * (targetContrastPrimary / targetContrast200)
                  // + getLightLoss(palette, 3, targetContrast300) * (targetContrastPrimary / targetContrast300)
                  // + getLightLoss(palette, 4, targetContrast400) * (targetContrastPrimary / targetContrast400)
                  // + getLightLoss(palette, 5, targetContrast500) * (targetContrastPrimary / targetContrast500)
                  // + getLightLoss(palette, 6, targetContrast600) * (targetContrastPrimary / targetContrast600)
                  + getLightLoss(palette, 7, targetContrastPrimary)
                  // + getLightLoss(palette, 8, targetContrast800) * (targetContrastPrimary / targetContrast800)
                  + getLightLoss(palette, 9, targetContrastStrongestPrimary) * (targetContrastPrimary / targetContrastStrongestPrimary);

                if (loss < bestLoss) {
                  bestPalette = palette;
                  bestLoss = loss;

                  setHueOffset(ho);
                  setLightness1(l1);
                  setLightness2(l2);

                  console.log('light loss updated', bestLoss);
                }
              // }
            // }
          // }
        }
      }
    // }

    const endTimestamp = Date.now();

    console.log('Time taken: ', (endTimestamp - startTimestamp), 'ms');

    setLightPalette(bestPalette);

    console.log('BEST LIGHT LOSS', bestLoss);
    console.log('BEST LIGHT PALETTE', bestPalette);
  }

  function performDarkPaletteSearch() {
    const startTimestamp = Date.now();

    let bestPalette;
    let bestLoss = Infinity;

    const ho = 3.762;

    // for (let ho = 0; ho <= 2 * Math.PI / TOTAL_HUES; ho += degreesToRadians(1)) {
      for (let l1 = 0; l1 <= 1; l1 += 0.1) {
        for (let l2 = 0; l2 <= 3; l2 += 0.1) {
          // for (let l3 = 0; l3 <= 1; l3 += 0.1) {
            // for (let l4 = 0; l4 <= 3; l4 += 0.1) {
              // for (let l5 = 0; l5 <= 3; l5 += 0.05) {
                const palette = buildPalette({
                  isLight: false,
                  totalHues: TOTAL_HUES,
                  totalSteps: TOTAL_STEPS,
                  hueOffset: ho,
                  lightness1: l1,
                  lightness2: l2,
                  lightness3: 0,
                  lightness4: 1
                });

                const minDarkContrastLabel = getMinDarkContrast(palette, 4);
                if (minDarkContrastLabel < TARGET_LABEL_CONTRAST) {
                  continue;
                }

                const minDarkContrastPrimary = getMinDarkContrast(palette, 3);
                if (minDarkContrastPrimary < TARGET_PRIMARY_CONTRAST) {
                  continue;
                }

                const minDarkContrastStrongPrimary = getMinDarkContrast(palette, 2);
                if (minDarkContrastStrongPrimary < TARGET_STRONG_PRIMARY_CONTRAST) {
                  continue;
                }

                const minDarkContrastStrongestPrimary = getMinDarkContrast(palette, 1);
                if (minDarkContrastStrongestPrimary < TARGET_STRONGEST_PRIMARY_CONTRAST) {
                  continue;
                }

                const targetContrastBackground = TARGET_BACKGROUND_CONTRAST;
                // const targetContrast800 = getAverageDarkContrast(palette, 8);
                // const targetContrast700 = getAverageDarkContrast(palette, 7);
                // const targetContrast600 = getAverageDarkContrast(palette, 6);
                // const targetContrast500 = getAverageDarkContrast(palette, 5);
                // const targetContrast400 = getAverageDarkContrast(palette, 4);
                const targetContrastPrimary = TARGET_PRIMARY_CONTRAST;
                // const targetContrast200 = getAverageDarkContrast(palette, 2);
                const targetContrastStrongestPrimary = TARGET_STRONGEST_PRIMARY_CONTRAST;

                const loss = 0
                  + getBlackLoss(palette, 9, targetContrastBackground) * (targetContrastPrimary / targetContrastBackground)
                  // + getDarkLoss(palette, 8, targetContrast800) * (targetContrast300 / targetContrast800)
                  // + getDarkLoss(palette, 7, targetContrast700) * (targetContrast300 / targetContrast700)
                  // + getDarkLoss(palette, 6, targetContrast600) * (targetContrast300 / targetContrast600)
                  // + getDarkLoss(palette, 5, targetContrast500) * (targetContrast300 / targetContrast500)
                  // + getDarkLoss(palette, 4, targetContrast400) * (targetContrast300 / targetContrast400)
                  + getDarkLoss(palette, 3, targetContrastPrimary)
                  // + getDarkLoss(palette, 2, targetContrast200) * (targetContrast300 / targetContrast200)
                  + getDarkLoss(palette, 1, targetContrastStrongestPrimary) * (targetContrastPrimary / targetContrastStrongestPrimary);

                if (loss < bestLoss) {
                  bestPalette = palette;
                  bestLoss = loss;

                  // setHueOffset(ho);
                  setLightness3(l1);
                  setLightness4(l2);

                  console.log('dark loss updated', bestLoss);
                }
              // }
            // }
          // }
        }
      }
    // }

    const endTimestamp = Date.now();

    console.log('Time taken: ', (endTimestamp - startTimestamp), 'ms');

    setDarkPalette(bestPalette);

    console.log('BEST DARK LOSS', bestLoss);
    console.log('BEST DARK PALETTE', bestPalette);
  }

  function jumpToPreviousSuitableHueOffset() {
    for (let ho = hueOffset - 0.001; ho >= 0; ho -= 0.001) {
      const lightPalette = buildPalette({
        isLight: true,
        totalHues: TOTAL_HUES,
        totalSteps: TOTAL_STEPS,
        hueOffset: ho,
        lightness1: lightness1,
        lightness2: lightness2,
        lightness3: 0,
        lightness4: 1
      });

      const isSuitable = lightPalette.every((steps) => {
        return steps[6].lightContrast >= 3 &&
          steps[7].lightContrast >= 4.5 &&
          steps[8].lightContrast >= 7 &&
          steps[9].lightContrast >= 11;
      });

      if (isSuitable) {
        setLightPalette(lightPalette);
        setHueOffset(ho);
        break;
      }
    }
  }

  function jumpToNextSuitableHueOffset() {
    console.log('JUMP');
    for (let ho = hueOffset + 0.001; ho <= degreesToRadians(360); ho += 0.001) {
      const lightPalette = buildPalette({
        isLight: true,
        totalHues: TOTAL_HUES,
        totalSteps: TOTAL_STEPS,
        hueOffset: ho,
        lightness1: lightness1,
        lightness2: lightness2,
        lightness3: 0,
        lightness4: 1
      });

      const isSuitable = lightPalette.every((steps) => {
        return steps[6].lightContrast >= 3 &&
          steps[7].lightContrast >= 4.5 &&
          steps[8].lightContrast >= 7 &&
          steps[9].lightContrast >= 11;
      });

      if (isSuitable) {
        setLightPalette(lightPalette);
        setHueOffset(ho);
        break;
      }
    }
  }

  function degreesToRadians(degrees: number): number {
    return degrees / 180 * Math.PI;
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
                      ? 'WHITE'
                      : (stepIndex === 10)
                        ? 'BLACK'
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
                            (stepIndex === 6 && step.lightContrast >= 3 && step.lightContrast <= 4.5) ||
                            (stepIndex === 7 && step.lightContrast >= 4.5 && step.lightContrast <= 7) ||
                            (stepIndex === 8 && step.lightContrast >= 7 && step.lightContrast <= 11) ||
                            (stepIndex === 9 && step.lightContrast >= 11)
                          )
                            ? 'color-contrast-satisfying'
                            : ''
                        ].join(' ')}>{step.lightContrast.toFixed(2)}</div>) : null}
                      </div>
                  )
              )}
            </div>
            <div className="controls">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={hueOffset}
                onChange={(value) => setHueOffset(value)}
                min={0}
                max={degreesToRadians(360)}
                step={0.001}
              />
              <button type="button" onClick={jumpToPreviousSuitableHueOffset}>←</button>
              {hueOffset}
              <button type="button" onClick={jumpToNextSuitableHueOffset}>→</button>
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
                      ? 'WHITE'
                      : (stepIndex === 10)
                        ? 'BLACK'
                        : 1000 - stepIndex * 100}
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
                            (stepIndex === 4 && step.darkContrast >= 3 && step.darkContrast <= 4.5) ||
                            (stepIndex === 3 && step.darkContrast >= 4.5 && step.darkContrast <= 7) ||
                            (stepIndex === 2 && step.darkContrast >= 7 && step.darkContrast <= 11) ||
                            (stepIndex === 1 && step.darkContrast >= 11)
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
