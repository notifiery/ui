import React, { useEffect, useState } from 'react';
import './App.scss';
import * as wcagContrast from 'wcag-contrast';
import ReactSlider from 'react-slider';
import interpolator from 'natural-spline-interpolator';
import * as culori from 'culori';

function App() {
  const showContrastScores = true;

  const chromaInterpolator = interpolator([[0, 0.25], [0.5, 0.4], [1, 0.25]]);

  const GOLDEN_RATIO = 1.618033988749;

  const [lightPalette, setLightPalette] = useState<any>(null);
  const [darkPalette, setDarkPalette] = useState<any>(null);

  const [bestLightLoss, setBestLightLoss] = useState<number>(Infinity);
  const [bestDarkLoss, setBestDarkLoss] = useState<number>(Infinity);

  const [hueOffset, setHueOffset] = useState<any>(0);

  const [lightLightness1, setLightLightness1] = useState<any>(0);
  const [lightLightness2, setLightLightness2] = useState<any>(0);
  const [lightChroma1, setLightChroma1] = useState<any>(0);
  const [lightChroma2, setLightChroma2] = useState<any>(0);

  const [darkLightness1, setDarkLightness1] = useState<any>(0);
  const [darkLightness2, setDarkLightness2] = useState<any>(0);
  const [darkChroma1, setDarkChroma1] = useState<any>(0);
  const [darkChroma2, setDarkChroma2] = useState<any>(0);

  const TOTAL_HUES = 12;
  const TOTAL_STEPS = 10;
  // const MAX_CHROMA = 0.25;
  const HUE_OFFSET = 0;

  // useEffect(() => {
  //   const lightPalette = buildPalette({
  //     totalHues: TOTAL_HUES,
  //     totalSteps: TOTAL_STEPS,
  //     hueOffset,
  //     lightness1: lightLightness1,
  //     lightness2: lightLightness2,
  //     chroma1: lightChroma1,
  //     chroma2: lightChroma2
  //   });

  //   const darkPalette = buildPalette({
  //     totalHues: TOTAL_HUES,
  //     totalSteps: TOTAL_STEPS,
  //     hueOffset,
  //     lightness1: darkLightness1,
  //     lightness2: darkLightness2,
  //     chroma1: darkChroma1,
  //     chroma2: darkChroma2
  //   });

  //   const minLightContrast700 = getMinLightContrast(lightPalette, 7);
  //   const maxLightContrast700 = getMaxLightContrast(lightPalette, 7);
  //   const averageLightContrast700 = (minLightContrast700 + maxLightContrast700) / 2;
  //   const targetLightContrast700 = 5;

  //   const minLightContrast800 = getMinLightContrast(lightPalette, 8);
  //   const maxLightContrast800 = getMaxLightContrast(lightPalette, 8);
  //   const averageLightContrast800 = (minLightContrast800 + maxLightContrast800) / 2;
  //   const targetLightContrast800 = 7;

  //   const minLightContrast900 = getMinLightContrast(lightPalette, 9);
  //   const maxLightContrast900 = getMaxLightContrast(lightPalette, 9);
  //   const averageLightContrast900 = (minLightContrast900 + maxLightContrast900) / 2;
  //   const targetLightContrast900 = 11;

  //   const minDarkContrast300 = getMinDarkContrast(darkPalette, 3);
  //   const maxDarkContrast300 = getMaxDarkContrast(darkPalette, 3);
  //   const averageDarkContrast300 = (minDarkContrast300 + maxDarkContrast300) / 2;
  //   const targetDarkContrast300 = 4.5;

  //   const minDarkContrast200 = getMinDarkContrast(darkPalette, 2);
  //   const maxDarkContrast200 = getMaxDarkContrast(darkPalette, 2);
  //   const averageDarkContrast200 = (minDarkContrast200 + maxDarkContrast200) / 2;
  //   const targetDarkContrast200 = 7;

  //   const minDarkContrast100 = getMinDarkContrast(darkPalette, 1);
  //   const maxDarkContrast100 = getMaxDarkContrast(darkPalette, 1);
  //   const averageDarkContrast100 = (minDarkContrast100 + maxDarkContrast100) / 2;
  //   const targetDarkContrast100 = 11;

  //   const lightLoss = Math.abs(averageLightContrast700 - targetLightContrast700)
  //     + Math.abs(averageLightContrast800 - targetLightContrast800)
  //     + Math.abs(averageLightContrast900 - targetLightContrast900);

  //   const darkLoss = Math.abs(averageDarkContrast300 - targetDarkContrast300)
  //     + Math.abs(averageDarkContrast200 - targetDarkContrast200)
  //     + Math.abs(averageDarkContrast100 - targetDarkContrast100);

  //   if (lightLoss < bestLightLoss) {
  //     setLightPalette(lightPalette);
  //     setBestLightLoss(lightLoss);
  //   }

  //   if (darkLoss < bestDarkLoss) {
  //     setDarkPalette(darkPalette);
  //     setBestDarkLoss(darkLoss);
  //   }
  // }, [
  //   hueOffset,
  //   lightLightness1,
  //   lightLightness2,
  //   lightChroma1,
  //   lightChroma2,
  //   darkLightness1,
  //   darkLightness2,
  //   darkChroma1,
  //   darkChroma2
  // ]);

  function calculateChroma(x: number, chroma1: number, chroma2: number): number {
    return 0.25; //chromaInterpolator(x);

    return 0.25 /*Math.max(0.25, 1
      - (chroma1 * x)
      - (chroma2 * (x ** 2)));*/
  }

  function calculateLightness(x: number, lightness1: number, lightness2: number, lightness3: number, lightness4: number, lightness5: number): number {
    return Math.max(0, 1
      - (lightness1 * (x ** (1/2)))
      - (lightness2 * (x ** (1/3)))
      - (lightness3 * x)
      - (lightness4 * (x ** 2))
      - (lightness5 * (x ** 3))
    );

    // console.log(
    //   lightness1,
    //   lightness2,
    //   lightness3,
    //   lightness4,
    //   lightness5
    // );

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

      const color = culori.oklab({
        l: lightness,
        a: 0,
        b: 0
      });

      steps.push({
        hex: culori.formatHex(color),
        darkContrast: 0,
        lightContrast: 0
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
        const a = C * Math.cos(h);
        const b = C * Math.sin(h);
        const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4, lightness5);

        const color = culori.oklab({
          l: lightness,
          a,
          b
        });

        steps.push({
          hex: culori.formatHex(color),
          darkContrast: 0,
          lightContrast: 0
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
      }
    }

    return hues;
  }

  function getLightLoss(palette: any, stepIndex: number, targetContrast: number) {
    return palette.reduce((loss: number, steps: any) => {
      return loss + Math.abs(steps[stepIndex].lightContrast - targetContrast);
    }, 0);
  }

  // function getMinLightContrast(palette: any, stepIndex: number) {
  //   return palette.reduce((contrast: number, steps: any) => {
  //     return Math.min(contrast, steps[stepIndex].lightContrast);
  //   }, Infinity);
  // }

  // function getMaxLightContrast(palette: any, stepIndex: number) {
  //   return palette.reduce((contrast: number, steps: any) => {
  //     return Math.max(contrast, steps[stepIndex].lightContrast);
  //   }, -Infinity);
  // }

  function getMinDarkContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.min(contrast, steps[stepIndex].darkContrast);
    }, Infinity);
  }

  function getMaxDarkContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.max(contrast, steps[stepIndex].darkContrast);
    }, -Infinity);
  }

  const [shouldSearch, setShouldSearch] = useState<boolean>(true);

  useEffect(() => {
    if (shouldSearch) {
      setShouldSearch(false);
      performLightPaletteSearch();
      // performDarkPaletteSearch();
    }
  }, [shouldSearch]);

  function performLightPaletteSearch() {
    let bestLightPalette;
    let bestLightLoss = Infinity;
    // let bestl1: number = 0;
    // let bestl2: number = 0;
    // let bestc1: number = 0;
    // let bestc2: number = 0;
    // let bestho: number = 0;

    // for (let ho = 0; ho <= 5; ho += 0.1) {
    for (let l1 = 0; l1 <= 1; l1 += 0.1) {
      for (let l2 = 0; l2 <= 1; l2 += 0.1) {
        for (let l3 = 0; l3 <= 1; l3 += 0.1) {
          for (let l4 = 0; l4 <= 1; l4 += 0.1) {
            for (let l5 = 0; l5 <= 1; l5 += 0.1) {
        // for (let c1 = 0; c1 <= 1; c1 += 0.1) {
          // for (let c2 = 0; c2 <= 1; c2 += 0.1) {
            const lightPalette = buildPalette({
              totalHues: TOTAL_HUES,
              totalSteps: TOTAL_STEPS,
              hueOffset: HUE_OFFSET,
              lightness1: l1,
              lightness2: l2,
              lightness3: l3,
              lightness4: l4,
              lightness5: l5,
              chroma1: 0,
              chroma2: 0
            });

            const targetContrast200 = 1.1;
            const targetContrast700 = 4.5;
            const targetContrast800 = targetContrast700 * GOLDEN_RATIO;
            const targetContrast900 = targetContrast800 * GOLDEN_RATIO;

            const loss200 = getLightLoss(lightPalette, 2, targetContrast200);
            const loss700 = getLightLoss(lightPalette, 7, targetContrast700);
            const loss900 = getLightLoss(lightPalette, 9, targetContrast900);

            // const minLightContrast700 = getMinLightContrast(lightPalette, 7);
            // const maxLightContrast700 = getMaxLightContrast(lightPalette, 7);
            // const averageLightContrast700 = (minLightContrast700 + maxLightContrast700) / 2;
            // const targetLightContrast700 = 4.5;

            // const minLightContrast800 = getMinLightContrast(lightPalette, 8);
            // const maxLightContrast800 = getMaxLightContrast(lightPalette, 8);
            // const averageLightContrast800 = (minLightContrast800 + maxLightContrast800) / 2;
            // const targetLightContrast800 = /* 7 */ targetLightContrast700 * GOLDEN_RATIO;

            // const minLightContrast900 = getMinLightContrast(lightPalette, 9);
            // const maxLightContrast900 = getMaxLightContrast(lightPalette, 9);
            // const averageLightContrast900 = (minLightContrast900 + maxLightContrast900) / 2;
            // const targetLightContrast900 = /*11*/ /*10*/ targetLightContrast800 * GOLDEN_RATIO;

            // const minLightContrast600 = getMinLightContrast(lightPalette, 6);
            // const maxLightContrast600 = getMaxLightContrast(lightPalette, 6);
            // const averageLightContrast600 = (minLightContrast600 + maxLightContrast600) / 2;
            // const targetLightContrast600 = /* 7 */ targetLightContrast700 / GOLDEN_RATIO;

            // const minLightContrast500 = getMinLightContrast(lightPalette, 5);
            // const maxLightContrast500 = getMaxLightContrast(lightPalette, 5);
            // const averageLightContrast500 = (minLightContrast500 + maxLightContrast500) / 2;
            // const targetLightContrast500 = /* 7 */ targetLightContrast600 / GOLDEN_RATIO;

            // const minLightContrast400 = getMinLightContrast(lightPalette, 4);
            // const maxLightContrast400 = getMaxLightContrast(lightPalette, 4);
            // const averageLightContrast400 = (minLightContrast400 + maxLightContrast400) / 2;
            // const targetLightContrast400 = /* 7 */ targetLightContrast500 / GOLDEN_RATIO;

            // const minLightContrast300 = getMinLightContrast(lightPalette, 3);
            // const maxLightContrast300 = getMaxLightContrast(lightPalette, 3);
            // const averageLightContrast300 = (minLightContrast300 + maxLightContrast300) / 2;
            // const targetLightContrast300 = /* 7 */ targetLightContrast400 / GOLDEN_RATIO;

            // const minLightContrast200 = getMinLightContrast(lightPalette, 2);
            // const maxLightContrast200 = getMaxLightContrast(lightPalette, 2);
            // const averageLightContrast200 = (minLightContrast200 + maxLightContrast200) / 2;
            // const targetLightContrast200 = 1.1; /* 7 */ /*targetLightContrast300 / GOLDEN_RATIO;*/

            // const minLightContrast100 = getMinLightContrast(lightPalette, 1);
            // const maxLightContrast100 = getMaxLightContrast(lightPalette, 1);
            // const averageLightContrast100 = (minLightContrast100 + maxLightContrast100) / 2;
            // const targetLightContrast100 = /* 7 */ targetLightContrast200 / GOLDEN_RATIO;

            // const lightLoss = 0
            //   + Math.abs(minLightContrast700 - targetLightContrast700)
            //   + Math.abs(maxLightContrast700 - targetLightContrast700)
              // + Math.pow(minLightContrast800 - targetLightContrast800, 2)
              // + Math.pow(maxLightContrast800 - targetLightContrast800, 2)
              // + Math.pow(minLightContrast900 - targetLightContrast900, 2)
              // + Math.pow(maxLightContrast900 - targetLightContrast900, 2)

          const lightLoss = loss200 + loss700 + loss900;

            // const lightLoss = Math.abs(minLightContrast700 - targetLightContrast700)
            //   + Math.abs(maxLightContrast700 - targetLightContrast700)
            //   // + Math.abs(minLightContrast800 - targetLightContrast800)
            //   // + Math.abs(maxLightContrast800 - targetLightContrast800)
            //   + Math.abs(minLightContrast900 - targetLightContrast900)
            //   + Math.abs(maxLightContrast900 - targetLightContrast900)
              // + Math.abs(averageLightContrast600 - targetLightContrast600)
              // + Math.abs(averageLightContrast500 - targetLightContrast500)
              // + Math.abs(averageLightContrast400 - targetLightContrast400)
              // + Math.abs(averageLightContrast300 - targetLightContrast300)
              // + Math.abs(averageLightContrast200 - targetLightContrast200) * 100
              // + Math.abs(averageLightContrast100 - targetLightContrast100)

            if (lightLoss < bestLightLoss) {
              bestLightPalette = lightPalette;
              bestLightLoss = lightLoss;

              console.log('loss700', loss700);

              // console.log('700', Math.abs(averageLightContrast700 - targetLightContrast700));
              // console.log('800', Math.abs(averageLightContrast800 - targetLightContrast800));
              // console.log('900', Math.abs(averageLightContrast900 - targetLightContrast900));
              // bestl1 = l1;
              // bestl2 = l2;
              // bestc1 = c1;
              // bestc2 = c2;
              // bestho = ho;
            }
          }
        }
          }
      }
    }
    // }

    setLightPalette(bestLightPalette);
    setDarkPalette(bestLightPalette);
    // setLightLightness1(bestl1);
    // setLightLightness2(bestl2);
    // setLightChroma1(bestc1);
    // setLightChroma2(bestc2);
    // setHueOffset(bestho);

    console.log('bestLightLoss', bestLightLoss);
  }

  function performDarkPaletteSearch() {
    let bestDarkPalette;
    let bestDarkLoss = Infinity;
    let bestl1: number = 0;
    let bestl2: number = 0;
    let bestc1: number = 0;
    let bestc2: number = 0;

    for (let l1 = 0; l1 <= 1; l1 += 0.1) {
      for (let l2 = 0; l2 <= 1; l2 += 0.1) {
        for (let c1 = 0; c1 <= 1; c1 += 0.1) {
          for (let c2 = 0; c2 <= 1; c2 += 0.1) {
            const darkPalette = buildPalette({
              totalHues: TOTAL_HUES,
              totalSteps: TOTAL_STEPS,
              hueOffset: HUE_OFFSET,
              lightness1: l1,
              lightness2: l2,
              lightness3: 0,
              lightness4: 0,
              lightness5: 0,
              chroma1: c1,
              chroma2: c2
            });

            const minDarkContrast300 = getMinDarkContrast(darkPalette, 3);
            const maxDarkContrast300 = getMaxDarkContrast(darkPalette, 3);
            const averageDarkContrast300 = (minDarkContrast300 + maxDarkContrast300) / 2;
            const targetDarkContrast300 = 11;

            // const minDarkContrast200 = getMinDarkContrast(darkPalette, 2);
            // const maxDarkContrast200 = getMaxDarkContrast(darkPalette, 2);
            // const averageDarkContrast200 = (minDarkContrast200 + maxDarkContrast200) / 2;
            // const targetDarkContrast200 = 17;

            // const minDarkContrast100 = getMinDarkContrast(darkPalette, 1);
            // const maxDarkContrast100 = getMaxDarkContrast(darkPalette, 1);
            // const averageDarkContrast100 = (minDarkContrast100 + maxDarkContrast100) / 2;
            // const targetDarkContrast100 = 17;

            const darkLoss = Math.abs(averageDarkContrast300 - targetDarkContrast300)
              // + Math.abs(averageDarkContrast200 - targetDarkContrast200)
              // + Math.abs(averageDarkContrast100 - targetDarkContrast100);

            if (darkLoss < bestDarkLoss) {
              bestDarkPalette = darkPalette;
              bestDarkLoss = darkLoss;
              bestl1 = l1;
              bestl2 = l2;
              bestc1 = c1;
              bestc2 = c2;
            }
          }
        }
      }
    }

    setDarkPalette(bestDarkPalette);
    setDarkLightness1(bestl1);
    setDarkLightness2(bestl2);
    setDarkChroma1(bestc1);
    setDarkChroma2(bestc2);
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

            {/* <div className="controls">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={lightLightness1}
                onChange={(value) => setLightLightness1(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={lightLightness2}
                onChange={(value) => setLightLightness2(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={lightChroma1}
                onChange={(value) => setLightChroma1(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={lightChroma2}
                onChange={(value) => setLightChroma2(value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div> */}
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

            {/* <div className="controls">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={darkLightness1}
                onChange={(value) => setDarkLightness1(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={darkLightness2}
                onChange={(value) => setDarkLightness2(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={darkChroma1}
                onChange={(value) => setDarkChroma1(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={darkChroma2}
                onChange={(value) => setDarkChroma2(value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div> */}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
