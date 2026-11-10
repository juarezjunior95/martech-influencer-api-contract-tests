import { SafeNumberCommand } from "./commands/SafeNumberCommand";
import { FormatValueCommand } from "./commands/FormatValueCommand";
import { FormatPeriodCommand } from "./commands/FormatPeriodCommand";
import { FormatCompactNumberCommand } from "./commands/FormatCompactNumberCommand";
import { FormatDateToQuarterCommand } from "./commands/FormatDateToQuarterCommand";
import { FormatDateToMonthCommand } from "./commands/FormatDateToMonthCommand";
import { FormatLyPeriodCommand } from "./commands/FormatLyPeriodCommand";
import { FormatFyPeriodCommand } from "./commands/FormatFyPeriodCommand";
import { FormatLqQuarterCommand } from "./commands/FormatLqQuarterCommand";
import { FormatLyQuarterCommand } from "./commands/FormatLyQuarterCommand";
import { FormatCurrentPeriodCommand } from "./commands/FormatCurrentPeriodCommand";
import { GetTrendCommand } from "./commands/GetTrendCommand";
import { GetColorUpDownCommand } from "./commands/GetColorUpDownCommand";
import { GetIndexColorCommand } from "./commands/audience-targeting/GetIndexColorCommand";
import { GetPerformanceColorCommand } from "./commands/GetPerformanceColorCommand";
import { FormatFinanceValueCommand } from "./commands/FormatFinanceValueCommand";
import { FormatPercentValueCommand } from "./commands/FormatPercentValueCommand";
import { FormatPeriodChipCommand } from "./commands/FormatPeriodChipCommand";
import { FormatPeriodRangeCommand } from "./commands/FormatPeriodRangeCommand";
import { LabelPeriodQuarterCommand } from "./commands/LabelPeriodQuarterCommand";
import { LabelPeriodMonthCommand } from "./commands/LabelPeriodMonthCommand";
import { FormatMonthLabelToQuarterCommand } from "./commands/FormatMonthLabelToQuarterCommand";
import { GetCountryMapCommand } from "./commands/resource-allocation-media/GetCountryMapCommand";
import { GetSegmentColorsCommand } from "./commands/resource-allocation-media/GetSegmentColorsCommand";
import { EnsureArrayCommand } from "./commands/EnsureArrayCommand";
import { ToNumberOrUndefinedCommand } from "./commands/ToNumberOrUndefinedCommand";

export const registerHelpers = (expression: any) => {
  const commands = [
    new SafeNumberCommand(),
    new FormatValueCommand(),
    new FormatPeriodCommand(),
    new FormatCompactNumberCommand(),
    new FormatDateToQuarterCommand(),
    new FormatDateToMonthCommand(),
    new FormatLyPeriodCommand(),
    new FormatFyPeriodCommand(),
    new FormatLqQuarterCommand(),
    new FormatLyQuarterCommand(),
    new FormatCurrentPeriodCommand(),
    new GetTrendCommand(),
    new GetColorUpDownCommand(),
    new GetIndexColorCommand(),
    new GetPerformanceColorCommand(),
    new FormatFinanceValueCommand(),
    new FormatPercentValueCommand(),
    new FormatPeriodChipCommand(),
    new FormatPeriodRangeCommand(),
    new LabelPeriodQuarterCommand(),
    new LabelPeriodMonthCommand(),
    new FormatMonthLabelToQuarterCommand(),
    new GetCountryMapCommand(),
    new GetSegmentColorsCommand(),
    new EnsureArrayCommand(),
    new ToNumberOrUndefinedCommand(),
  ];

  commands.forEach((command) => {
    expression.registerFunction(command.name, command.execute.bind(command));
  });
};
