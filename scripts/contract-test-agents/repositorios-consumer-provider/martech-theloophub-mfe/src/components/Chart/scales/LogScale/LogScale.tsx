import { LinearScale, Scale } from 'chart.js';

type LogFunction = (x: number) => number;

export class Log2Scale extends Scale {
  static readonly id = 'log2Scale';
  static readonly defaults = {};

  private _startValue!: number;
  private _valueRange!: number;
  private readonly _base!: number;
  private readonly _log!: LogFunction;

  constructor(cfg: any) {
    super(cfg);
    const { base, log } = cfg.chart.config.options.scales.y.log || {
      base: 2,
      log: Math.log2,
    };
    this._base = base;
    this._log = log;
    this._startValue = 0;
    this._valueRange = 0;
  }

  parse(raw: unknown, index: number): number | null {
    const value = LinearScale.prototype.parse.call(this, raw, index);
    return Number.isFinite(value) ? value : null;
  }

  determineDataLimits(): void {
    const { min, max } = this.getMinMax(true);
    this.min = Number.isFinite(min) ? min : null;
    this.max = Number.isFinite(max) ? max : null;
  }

  buildTicks() {
    const ticks = [];
    const aMin = Math.abs(this.min);
    const aMax = Math.abs(this.max);

    if (aMin <= this._base) {
      ticks.push({ value: this._base * Math.sign(this.min) });
    }

    const beginAtZero = (this.options as any).beginAtZero;

    let power = Math.floor(
      (aMin > this._base ? Math.sign(this.min) : 1) *
        this._log(beginAtZero && this.min > 0 ? 1 : Math.max(aMin, 1)),
    );

    const maxPower = Math.ceil(
      (aMax > this._base ? Math.sign(this.max) : 1) *
        this._log(beginAtZero && this.max < 0 ? 1 : Math.max(aMax, 1)),
    );

    while (power <= maxPower) {
      ticks.push({
        value: Math.sign(power) * Math.pow(this._base, Math.abs(power)),
      });
      power += 1;
    }

    if (aMax <= this._base) {
      ticks.push({ value: this._base * Math.sign(this.max) });
    }

    const values = ticks.map((tick) => tick.value);
    this.min = Math.min(...values);
    this.max = Math.max(...values);

    return ticks;
  }

  private getLogVal(v: number): number {
    const absValue = Math.abs(v);
    return absValue > this._base
      ? Math.sign(v) * this._log(absValue)
      : v / this._base;
  }

  public configure(): void {
    const start = this.min;
    super.configure();
    this._startValue = this.getLogVal(start);
    this._valueRange = this.getLogVal(this.max) - this.getLogVal(start);
  }

  getPixelForValue(value: number = this.min): number {
    const decimal =
      (this.getLogVal(value) - this._startValue) / this._valueRange;
    return this.getPixelForDecimal(decimal);
  }

  getValueForPixel(pixel: number): number {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(2, this._startValue + decimal * this._valueRange);
  }
}
