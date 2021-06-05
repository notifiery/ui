import React, { useEffect, useState } from 'react';
import './App.scss';
import { rgb } from 'wcag-contrast';
import ReactSlider from 'react-slider';

function App() {
  const showContrastScores = false;

  const MAX_LIGHTNESS = 0.9999999934735462;

  const [lightPalette, setLightPalette] = useState<any>(null);
  const [darkPalette, setDarkPalette] = useState<any>(null);

  const [bestLightLoss, setBestLightLoss] = useState<number>(Infinity);
  const [bestDarkLoss, setBestDarkLoss] = useState<number>(Infinity);

  const [maxChroma, setMaxChroma] = useState<number>(0.25);
  const [hueOffset, setHueOffset] = useState<any>(0/*0.5*/);

  const [lightLightness1, setLightLightness1] = useState<any>(0);
  const [lightLightness2, setLightLightness2] = useState<any>(0);
  const [lightLightness3, setLightLightness3] = useState<any>(0/*0.25*/);
  const [lightLightness4, setLightLightness4] = useState<any>(0/*0.5*/);

  const [darkLightness1, setDarkLightness1] = useState<any>(0);
  const [darkLightness2, setDarkLightness2] = useState<any>(0);
  const [darkLightness3, setDarkLightness3] = useState<any>(0/*0.25*/);
  const [darkLightness4, setDarkLightness4] = useState<any>(0/*0.5*/);

  const TOTAL_HUES = 12;
  const TOTAL_STEPS = 10;
  // const MAX_CHROMA = 0.25;
  const HUE_OFFSET = 0;

  useEffect(() => {
    const lightPalette = buildPalette({
      totalHues: TOTAL_HUES,
      totalSteps: TOTAL_STEPS,
      hueOffset,
      maxChroma,
      lightness1: lightLightness1,
      lightness2: lightLightness2,
      lightness3: lightLightness3,
      lightness4: lightLightness4
    });

    const darkPalette = buildPalette({
      totalHues: TOTAL_HUES,
      totalSteps: TOTAL_STEPS,
      hueOffset,
      maxChroma,
      lightness1: darkLightness1,
      lightness2: darkLightness2,
      lightness3: darkLightness3,
      lightness4: darkLightness4
    });

    const minLightContrast700 = getMinLightContrast(lightPalette, 7);
    const maxLightContrast700 = getMaxLightContrast(lightPalette, 7);
    const averageLightContrast700 = (minLightContrast700 + maxLightContrast700) / 2;
    const targetLightContrast700 = 5;

    const minLightContrast800 = getMinLightContrast(lightPalette, 8);
    const maxLightContrast800 = getMaxLightContrast(lightPalette, 8);
    const averageLightContrast800 = (minLightContrast800 + maxLightContrast800) / 2;
    const targetLightContrast800 = 7;

    const minLightContrast900 = getMinLightContrast(lightPalette, 9);
    const maxLightContrast900 = getMaxLightContrast(lightPalette, 9);
    const averageLightContrast900 = (minLightContrast900 + maxLightContrast900) / 2;
    const targetLightContrast900 = 11;

    const minDarkContrast300 = getMinDarkContrast(darkPalette, 3);
    const maxDarkContrast300 = getMaxDarkContrast(darkPalette, 3);
    const averageDarkContrast300 = (minDarkContrast300 + maxDarkContrast300) / 2;
    const targetDarkContrast300 = 4.5;

    const minDarkContrast200 = getMinDarkContrast(darkPalette, 2);
    const maxDarkContrast200 = getMaxDarkContrast(darkPalette, 2);
    const averageDarkContrast200 = (minDarkContrast200 + maxDarkContrast200) / 2;
    const targetDarkContrast200 = 7;

    const minDarkContrast100 = getMinDarkContrast(darkPalette, 1);
    const maxDarkContrast100 = getMaxDarkContrast(darkPalette, 1);
    const averageDarkContrast100 = (minDarkContrast100 + maxDarkContrast100) / 2;
    const targetDarkContrast100 = 11;

    const lightLoss = Math.abs(averageLightContrast700 - targetLightContrast700)
      + Math.abs(averageLightContrast800 - targetLightContrast800)
      + Math.abs(averageLightContrast900 - targetLightContrast900);

    const darkLoss = Math.abs(averageDarkContrast300 - targetDarkContrast300)
      + Math.abs(averageDarkContrast200 - targetDarkContrast200)
      + Math.abs(averageDarkContrast100 - targetDarkContrast100);

    if (lightLoss < bestLightLoss) {
      setLightPalette(lightPalette);
      setBestLightLoss(lightLoss);
    }

    if (darkLoss < bestDarkLoss) {
      setDarkPalette(darkPalette);
      setBestDarkLoss(darkLoss);
    }
  }, [
    maxChroma,
    hueOffset,
    lightLightness1,
    lightLightness2,
    lightLightness3,
    lightLightness4,
    darkLightness1,
    darkLightness2,
    darkLightness3,
    darkLightness4
  ]);

  function calculateLightness(x: number, lightness1: number, lightness2: number, lightness3: number, lightness4: number): number {
    return Math.max(0, MAX_LIGHTNESS
      - (lightness1 * (x ** (1/3)))
      - (lightness2 * (x ** (1/2)))
      - (lightness3 * (x ** 2))
      - (lightness4 * (x ** 3)));
  }

  function buildPalette({
    totalHues,
    totalSteps,
    hueOffset,
    maxChroma,
    lightness1,
    lightness2,
    lightness3,
    lightness4
  }: {
    totalHues: any,
    totalSteps: any,
    hueOffset: any,
    maxChroma: any,
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
      const color = oklabToRgb(lightness, 0, 0);

      steps.push({ color, darkContrast: 0, lightContrast: 0 });
    }

    hues.push(steps);

    // Other colors
    for (let hueIndex = 0; hueIndex < totalHues; hueIndex++) {
      const steps = [];
      const huePercentage = hueIndex / totalHues;
      const h = 2 * Math.PI * huePercentage + hueOffset;

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        const stepPercentage = stepIndex / totalSteps;
        const C = maxChroma * stepPercentage;
        const a = C * Math.cos(h);
        const b = C * Math.sin(h);
        const lightness = calculateLightness(stepPercentage, lightness1, lightness2, lightness3, lightness4);
        const color = oklabToRgb(lightness, a, b);

        steps.push({ color, darkContrast: 0, lightContrast: 0 });
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

        step.darkContrast = rgb(
          [darkestStep.color.r, darkestStep.color.g, darkestStep.color.b],
          [step.color.r, step.color.g, step.color.b]
        );

        step.lightContrast = rgb(
          [lightestStep.color.r, lightestStep.color.g, lightestStep.color.b],
          [step.color.r, step.color.g, step.color.b]
        );
      }
    }

    return hues;
  }

  function oklabToRgb(L: number, a: number, b: number) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

    return {
      r: clamp(255 * gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
      g: clamp(255 * gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
      b: clamp(255 * gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))
    };
  }

  function gamma(x: number): number {
    return (x >= 0.0031308)
      ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055
      : 12.92 * x;
  }

  function clamp(n: number): number {
    return Math.min(Math.max(0, Math.round(n)), 255);
  }

  function getMinLightContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.min(contrast, steps[stepIndex].lightContrast);
    }, Infinity);
  }

  function getMaxLightContrast(palette: any, stepIndex: number) {
    return palette.reduce((contrast: number, steps: any) => {
      return Math.max(contrast, steps[stepIndex].lightContrast);
    }, -Infinity);
  }

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
  }, [maxChroma, shouldSearch]);

  function performLightPaletteSearch() {
    let bestLightPalette;
    let bestLightLoss = Infinity;
    let bestl1: number = 0;
    let bestl2: number = 0;
    let bestl3: number = 0;
    let bestl4: number = 0;
    let bestho: number = 0;

    for (let ho = 0; ho <= 1; ho += 0.1) {
    for (let l1 = 0; l1 <= 1; l1 += 0.1) {
      for (let l2 = 0; l2 <= 1; l2 += 0.1) {
        for (let l3 = 0; l3 <= 1; l3 += 0.1) {
          for (let l4 = 0; l4 <= 1; l4 += 0.1) {
            const lightPalette = buildPalette({
              totalHues: TOTAL_HUES,
              totalSteps: TOTAL_STEPS,
              hueOffset: ho,
              maxChroma,
              lightness1: 0,
              lightness2: 0,
              lightness3: l3,
              lightness4: l4
            });

            const minLightContrast700 = getMinLightContrast(lightPalette, 7);
            // const maxLightContrast700 = getMaxLightContrast(lightPalette, 7);
            // const averageLightContrast700 = (minLightContrast700 + maxLightContrast700) / 2;
            const targetLightContrast700 = 4.5;

            const minLightContrast800 = getMinLightContrast(lightPalette, 8);
            const maxLightContrast800 = getMaxLightContrast(lightPalette, 8);
            const averageLightContrast800 = (minLightContrast800 + maxLightContrast800) / 2;
            const targetLightContrast800 = 7;

            const minLightContrast900 = getMinLightContrast(lightPalette, 9);
            const maxLightContrast900 = getMaxLightContrast(lightPalette, 9);
            const averageLightContrast900 = (minLightContrast900 + maxLightContrast900) / 2;
            const targetLightContrast900 = 11;

            const lightLoss = Math.abs(minLightContrast700 - targetLightContrast700)
              + Math.abs(averageLightContrast800 - targetLightContrast800)
              + Math.abs(averageLightContrast900 - targetLightContrast900);

            if (lightLoss < bestLightLoss) {
              bestLightPalette = lightPalette;
              bestLightLoss = lightLoss;
              bestl1 = l1;
              bestl2 = l2;
              bestl3 = l3;
              bestl4 = l4;
              bestho = ho;
            }
          }
        }
      }
    }
    }

    setLightPalette(bestLightPalette);
    setLightLightness1(bestl1);
    setLightLightness2(bestl2);
    setLightLightness3(bestl3);
    setLightLightness4(bestl4);
    setHueOffset(bestho);
  }

  function performDarkPaletteSearch() {
    let bestDarkPalette;
    let bestDarkLoss = Infinity;
    let bestl1: number = 0;
    let bestl2: number = 0;
    let bestl3: number = 0;
    let bestl4: number = 0;

    for (let l1 = 0; l1 <= 1; l1 += 0.1) {
      for (let l2 = 0; l2 <= 1; l2 += 0.1) {
        for (let l3 = 0; l3 <= 1; l3 += 0.1) {
          for (let l4 = 0; l4 <= 1; l4 += 0.1) {
            const darkPalette = buildPalette({
              totalHues: TOTAL_HUES,
              totalSteps: TOTAL_STEPS,
              hueOffset: HUE_OFFSET,
              maxChroma,
              lightness1: l1,
              lightness2: l2,
              lightness3: l3,
              lightness4: l4
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
              bestl3 = l3;
              bestl4 = l4;
            }
          }
        }
      }
    }

    setDarkPalette(bestDarkPalette);
    setDarkLightness1(bestl1);
    setDarkLightness2(bestl2);
    setDarkLightness3(bestl3);
    setDarkLightness4(bestl4);
  }

  return (
    <div className="App">
      {(lightPalette && darkPalette) ? (
        <div className="modes">
          <div className="mode mode-light"
            style={{
              background: `rgb(${lightPalette[0][1].color.r}, ${lightPalette[0][1].color.g}, ${lightPalette[0][1].color.b})`,
              color: `rgb(${lightPalette[0][9].color.r}, ${lightPalette[0][9].color.g}, ${lightPalette[0][9].color.b})`
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
                        style={{ background: `rgb(${step.color.r}, ${step.color.g}, ${step.color.b})` }}>
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

            <div className="controls">
              {/* <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={maxChroma}
                onChange={(value) => setMaxChroma(value)}
                min={0}
                max={1}
                step={0.01}
              /> */}

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
                value={lightLightness3}
                onChange={(value) => setLightLightness3(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={lightLightness4}
                onChange={(value) => setLightLightness4(value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>
          <div className="mode mode-dark"
            style={{
              background: `rgb(${darkPalette[0][9].color.r}, ${darkPalette[0][9].color.g}, ${darkPalette[0][9].color.b})`,
              color: `rgb(${darkPalette[0][1].color.r}, ${darkPalette[0][1].color.g}, ${darkPalette[0][1].color.b})`
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
                        style={{ background: `rgb(${step.color.r}, ${step.color.g}, ${step.color.b})` }}>
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

            <div className="controls">
              {/* <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={maxChroma}
                onChange={(value) => setMaxChroma(value)}
                min={0}
                max={1}
                step={0.01}
              /> */}

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
                value={darkLightness3}
                onChange={(value) => setDarkLightness3(value)}
                min={0}
                max={1}
                step={0.01}
              />

              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={darkLightness4}
                onChange={(value) => setDarkLightness4(value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
