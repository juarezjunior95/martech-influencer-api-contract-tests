# JSONata Global Helpers

This project uses a set of custom global helper functions available in JSONata expressions. These helpers are implemented using the **Command Pattern** in TypeScript and registered centrally.

## Architecture

- **Commands**: Each helper is a separate class in `src/infrastructure/repositories/helpers/commands/`.
- **Registration**: All helpers are registered via `registerHelpers()` in `src/infrastructure/repositories/helpers/index.ts`.
- **Usage**: Helpers are available as global functions in any JSONata expression processed by `FormatterRepository`.

## Available Helpers

### `safeNumber(value)`
Safely converts a value to a number. Returns `0` if the value is invalid, null, or undefined.
- **Example**: `safeNumber("10")` -> `10`
- **Example**: `safeNumber(null)` -> `0`

### `formatValue(value)`
Formats a number with commas and exactly one decimal place. Returns `-` for invalid inputs.
- **Example**: `formatValue(1234.56)` -> `"1,234.6"`
- **Example**: `formatValue(1000)` -> `"1,000.0"`

### `formatNumberWithCommas(value)`
Alias/Similar to `formatValue`, ensures comma separation and fixed decimal precision.
- **Example**: `formatNumberWithCommas(5000)` -> `"5,000.0"`

### `formatCompactNumber(value)`
Formats large numbers with suffixes (K, M, B) and one decimal place.
- **Example**: `formatCompactNumber(1500)` -> `"1.5K"`
- **Example**: `formatCompactNumber(2500000)` -> `"2.5M"`
- **Example**: `formatCompactNumber(3500000000)` -> `"3.5B"`

### `formatPeriod(dateString)`
Formats a date string (YYYY-MM-DD) to `Mon'YY`.
- **Example**: `formatPeriod("2024-01-01")` -> `"Jan'24"`

### `formatLyPeriod(dateString)`
Takes a date string and returns the `Mon'YY` format for the **same month in the previous year**.
- **Example**: `formatLyPeriod("2024-03-01")` -> `"Mar'23"`

### `formatDateToQuarter(dateString)`
Formats a date to `Qx'YY`.
- **Example**: `formatDateToQuarter("2024-05-15")` -> `"Q2'24"`

### `formatDateToMonth(dateString)`
Formats a date to `Mon'YY` (wrapper around standard format logic).
- **Example**: `formatDateToMonth("2024-11-20")` -> `"Nov'24"`

### `formatPeriodRange(startDate, endDate)`

Formats a date range as `Mon-Mon'YY`. When `startDate` and `endDate` are in the same month, it falls back to a single `Mon'YY` label. Returns `-` for invalid/missing dates. Dates are interpreted in UTC.

- **Example**: `formatPeriodRange("2026-01-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z")` -> `"Jan-Mar'26"`
- **Example**: `formatPeriodRange("2026-03-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z")` -> `"Mar'26"`
- **Example**: `formatPeriodRange(null, "2026-03-31T00:00:00.000Z")` -> `"-"`

### `formatPeriodChip(startDate, endDate, period, isQuarter?)`

Builds the label used in period chips, combining a date label with the period suffix (case-insensitive, uppercased in the output). Behavior:

- `isQuarter = true` -> `Qx'YY <PERIOD>` (uses `formatDateToQuarter` on `endDate`).
- `period` is `YTD` or `L3M` -> `Mon-Mon'YY <PERIOD>` (uses `formatPeriodRange`).
- Any other monthly period (e.g. `MTD`) -> `Mon'YY <PERIOD>` (uses `formatDateToMonth` on `endDate`).
- Empty/missing period -> just the month or quarter label of `endDate`.
- **Example**: `formatPeriodChip("2026-01-01...", "2026-03-31...", "YTD")` -> `"Jan-Mar'26 YTD"`
- **Example**: `formatPeriodChip("2026-03-01...", "2026-03-31...", "MTD")` -> `"Mar'26 MTD"`
- **Example**: `formatPeriodChip("2026-01-01...", "2026-03-31...", "LQ", true)` -> `"Q1'26 LQ"`

### `formatPercentValue(value, suffix?)`

Formats a number with exactly one decimal place and appends a suffix (defaults to `%`). Accepts numeric strings. Returns `-` for `null`, `undefined`, or non-numeric input.

- **Example**: `formatPercentValue(1.234)` -> `"1.2%"`
- **Example**: `formatPercentValue("2.25")` -> `"2.3%"`
- **Example**: `formatPercentValue(0.8, "pp")` -> `"0.8pp"`
- **Example**: `formatPercentValue(null)` -> `"-"`

### `getTrend(value, direction)`
Returns `"positive"` or `"negative"` for trend display. When value is null, undefined, or zero, returns `"positive"` (neutral). Otherwise: `direction === "up"` -> `"positive"`, else -> `"negative"`. Direction is case-insensitive.
- **Example**: `getTrend(5.2, "up")` -> `"positive"`
- **Example**: `getTrend(-1.3, "down")` -> `"negative"`
- **Example**: `getTrend(0, "down")` -> `"positive"`

## How to Add a New Helper

1.  Create a new Command class in `src/infrastructure/repositories/helpers/commands/MyNewCommand.ts`:
    ```typescript
    export class MyNewCommand {
        public readonly name = "myNewHelper";

        execute(arg: any): any {
            // implementation
            return arg;
        }
    }
    ```
2.  Register it in `src/infrastructure/repositories/helpers/index.ts`:
    ```typescript
    import { MyNewCommand } from "./commands/MyNewCommand";

    export const registerHelpers = (expression: any) => {
      const commands = [
        // ... existing commands
        new MyNewCommand(),
      ];
      // ...
    };
    ```
3.  Add unit tests in `test/unit/infrastructure/repositories/helpers/commands/MyNewCommand.spec.ts`.
