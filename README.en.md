# Greenhouse Control Lab · Temperature × heater usage

[中文](README.md) · **[Open the playground →](https://flessnerchernosky-ops.github.io/greenhouse-control-lab/?lang=en)** · [Research roadmap](ROADMAP.md)

Does a steady temperature always mean less heating? Four fictional greenhouses share the same weather. Compare an on/off thermostat, ordinary PID, anti-windup PID and feedforward, then inspect the trade-off between temperature error and heater usage.

![Greenhouse experiment sampled from actual model output](docs/preview.gif)

No hardware, account or installation. The bilingual interface supports mobile. Open `docs/index.html` offline or use the demo. No browser dependencies, trackers or experiment uploads. A light editorial interface and dark experiment charts share the Control Studio design.

## Start in 3 minutes

1. Select “Heater memory debt” and finish the experiment. The initial 34°C target is unreachable; at 120 s it drops to 22°C.
2. Compare ordinary PID with anti-windup: inspect curves, final-window error and heater usage.
3. Change one parameter, complete another run and export CSV. Language switching preserves the run; scenario or parameter changes reset to a paused run.

## A reproducible result

`windup`: 6 s delay, 50% heater limit, Kp = 0.16, Ki = 0.008, heat-loss estimate 1×, duration 360 s, initial temperature 18°C.

| Method | Full-run MAE °C | Final 120 s MAE °C | Full-power equivalent seconds |
|---|---:|---:|---:|
| On/off thermostat | 4.349 | 0.566 | 138.9 |
| Ordinary PID | 5.862 | 2.993 | 177.0 |
| PID + anti-windup | 4.148 | 0.009 | 138.7 |
| Feedforward + anti-windup PID | 4.185 | 0.011 | 138.2 |

Anti-windup reduces both error and heating in this case. This is not a measured electricity bill or a universal savings rate. In the mild scene, feedforward has full-run MAE about 0.381°C versus 0.360°C for anti-windup alone. In the cold front it improves error while slightly increasing heater usage. Significant oscillations remain at 20 s delay: anti-windup does not remove transport delay.

[benchmarks.json](benchmarks.json) stores **15 configurations / 60 controller-trajectory metrics**: 5 scenes × 3 delays × 4 methods. [data/](data/) contains complete raw records for the five scene presets. Deterministic reruns are not independent random trials and do not provide statistical confidence intervals.

## Reproduce locally

Node.js 18+ and Python 3.9+. Core checks use standard libraries only, with no npm or Python package installation. From the repository root:

```sh
node test.cjs
node benchmark.cjs --check
python verify.py
```

15 model/export checks, complete benchmark comparison, and an independent Python analytic plant replay plus metric audit: 9,000 CSV rows / 36,000 controller temperature samples. The replay does not reimplement controllers or establish their superiority.

After changing the model, regenerate with `node benchmark.cjs`; explain changes and retain failure cases. Optionally preview with `python -m http.server 8000 --bind 127.0.0.1 --directory docs`.

## CSV and metrics

Export is enabled only after 360 s. The first line `# {...}` stores settings, scene, step, duration and completion. Line 2 contains field names followed by 1,800 rows. Read metadata before `csv.DictReader`; pandas can use `comment="#"`.

Each row stores end-of-interval temperature and the input actually applied over the preceding 0.2 s. Target and ambient fields describe conditions held in that interval. MAE averages absolute temperature error over equally spaced samples, including the initial transient. The final window is (240,360] s: 600 samples. Heater usage is `Σ applied_command × 0.2`, measured in full-rated-power equivalent seconds. For a known rating P kW, P × equivalent seconds / 3600 would give kWh; this project supplies no real heater rating, electricity tariff or measured efficiency.

## Plant and control assumptions

- `dT/dt = 0.55u − 0.025(T − T_out)`, heating only; exact exponential update for held conditions. dt = 0.2 s, duration 360 s, T(0) = 18°C.
- With 14°C ambient and a 50% heater limit, equilibrium is only 25°C: the 34°C target is physically unreachable.
- The thermostat has ±0.35°C hysteresis. PID differentiates measurement, with a 2 s low-pass filter and Kd = 0.8.
- `raw = Kp × error + I − Kd × filtered_slope + feedforward`. Clip raw to [0,power], then update I. Ordinary PID adds `dt × Ki × error`; anti-windup also adds `dt × 0.12 × (limited − raw)`.
- Feedforward uses current ambient: `estimate × 0.025 × (target − outside) / 0.55`; no future-weather preview.
- The command queue starts at zero; delay must be an integer multiple of dt. Back calculation handles sent-command saturation, not commands still waiting in the transport queue.
- Exact measurements, no noise/estimation. No plant growth, humidity, active cooling, solar radiation, building thermal network or hardware. Original simplified implementation, not a novel control algorithm or evidence of real greenhouse energy savings.

## Develop a personal contribution

Use [ROADMAP.md](ROADMAP.md) to design an independent evaluation with matched conditions and tuning budgets. Report temperature error, heater usage and failures together. Initial code and documentation were AI-assisted; distinguish your actual modifications, experiments and verification in application materials.

Principle references: [MathWorks back-calculation anti-windup](https://www.mathworks.com/help/simulink/slref/anti-windup-control-using-a-pid-controller.html), [python-control anti-windup example](https://python-control.readthedocs.io/en/stable/examples/cruise-control.html). These are references, not current MATLAB/Simulink/python-control integrations. [MIT License](LICENSE) · [Contributing](CONTRIBUTING.md).

Optional preview/cover regeneration: install Pillow, then run `python build_preview.py`. The animation uses the saved `windup` trace, not a separate simulation.
