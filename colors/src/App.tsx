import React, { useEffect, useState } from 'react';
import './App.scss';
import { rgb } from 'wcag-contrast';
import ReactSlider from 'react-slider';

function App() {
  const [colors, setColors] = useState<any>(null);
  const [maxChroma, setMaxChroma] = useState<number>(0.25);
  const [lightness1, setLightness1] = useState<number>(0);
  const [lightness2, setLightness2] = useState<number>(0);
  const [lightness3, setLightness3] = useState<number>(0.25);
  const [lightness4, setLightness4] = useState<number>(0.5);

  const TOTAL_HUES = 12;
  const TOTAL_STEPS = 11;
  // const MAX_CHROMA = 0.25;
  const HUE_OFFSET = 0;

  useEffect(() => {
    const colors = buildColors({
      totalHues: TOTAL_HUES,
      totalSteps: TOTAL_STEPS,
      hueOffset: HUE_OFFSET,
      maxChroma
    });

    setColors(colors);

    function calculateLightness(x: number): number {
      return 1
        - (lightness1 * (x ** (1/3)))
        - (lightness2 * (x ** (1/2)))
        - (lightness3 * (x ** 2))
        - (lightness4 * (x ** 3));
    }

    function buildColors({
      totalHues,
      totalSteps,
      hueOffset,
      maxChroma
    }: {
      totalHues: any,
      totalSteps: any,
      hueOffset: any,
      maxChroma: any
    }) {
      const hues = [];

      // Gray color
      const steps = [];

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        const stepPercentage = stepIndex / totalSteps;
        const lightness = calculateLightness(stepPercentage);
        const color = oklabToRgb([lightness, 0, 0]);

        steps.push({
          color,
          blackContrast: rgb([0, 0, 0], [color.r, color.g, color.b]),
          whiteContrast: rgb([255, 255, 255], [color.r, color.g, color.b])
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
          const C = maxChroma * stepPercentage;
          const a = C * Math.cos(h);
          const b = C * Math.sin(h);
          const lightness = calculateLightness(stepPercentage);
          const color = oklabToRgb(lightness, a, b);

          steps.push({
            color,
            blackContrast: rgb([0, 0, 0], [color.r, color.g, color.b]),
            whiteContrast: rgb([255, 255, 255], [color.r, color.g, color.b])
          });
        }

        hues.push(steps);
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
  }, [
    maxChroma,
    lightness1,
    lightness2,
    lightness3,
    lightness4
  ]);

  return (
    <div className="App">
      <div className="colors">
        {(colors) ? (
          colors[0].map(
            (step: any, stepIndex: number) =>
              <div key={stepIndex} className="color-step">
                {(stepIndex === 0)
                  ? null
                  : (stepIndex === 1)
                    ? 50
                    : (stepIndex - 1) * 100}
              </div>
          )
        ) : null}

        {(colors) ? (
          colors.map(
            (steps: any, hueIndex: number) =>
              steps.map(
                (step: any, stepIndex: number) =>
                  <div
                    key={`${hueIndex}-${stepIndex}`}
                    className="color"
                    style={{ background: `rgb(${step.color.r}, ${step.color.g}, ${step.color.b})` }}>
                    <div className="color-contrast-white">{step.whiteContrast.toFixed(2)}</div>
                    <div className="color-contrast-black">{step.blackContrast.toFixed(2)}</div>
                  </div>
              )
          )
        ) : null}
      </div>

      <div className="controls">
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={maxChroma}
          onChange={(value) => setMaxChroma(value)}
          min={0}
          max={1}
          step={0.01}
        />

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={lightness1}
          onChange={(value) => setLightness1(value)}
          min={0}
          max={1}
          step={0.01}
        />

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={lightness2}
          onChange={(value) => setLightness2(value)}
          min={0}
          max={1}
          step={0.01}
        />

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={lightness3}
          onChange={(value) => setLightness3(value)}
          min={0}
          max={1}
          step={0.01}
        />

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={lightness4}
          onChange={(value) => setLightness4(value)}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
}

export default App;
