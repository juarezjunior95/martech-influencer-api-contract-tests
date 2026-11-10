"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHelpers = void 0;
const SafeNumberCommand_1 = require("./commands/SafeNumberCommand");
const FormatValueCommand_1 = require("./commands/FormatValueCommand");
const FormatSignedValueCommand_1 = require("./commands/FormatSignedValueCommand");
const FormatPeriodCommand_1 = require("./commands/FormatPeriodCommand");
const FormatCompactNumberCommand_1 = require("./commands/FormatCompactNumberCommand");
const FormatDateToQuarterCommand_1 = require("./commands/FormatDateToQuarterCommand");
const FormatDateToMonthCommand_1 = require("./commands/FormatDateToMonthCommand");
const FormatLyPeriodCommand_1 = require("./commands/FormatLyPeriodCommand");
const FormatFyPeriodCommand_1 = require("./commands/FormatFyPeriodCommand");
const FormatYtdPeriodCommand_1 = require("./commands/FormatYtdPeriodCommand");
const FormatLqQuarterCommand_1 = require("./commands/FormatLqQuarterCommand");
const FormatLyQuarterCommand_1 = require("./commands/FormatLyQuarterCommand");
const FormatCurrentPeriodCommand_1 = require("./commands/FormatCurrentPeriodCommand");
const GetTrendCommand_1 = require("./commands/GetTrendCommand");
const GetColorUpDownCommand_1 = require("./commands/GetColorUpDownCommand");
const GetIndexColorCommand_1 = require("./commands/audience-targeting/GetIndexColorCommand");
const GetPerformanceColorCommand_1 = require("./commands/GetPerformanceColorCommand");
const FormatFinanceValueCommand_1 = require("./commands/FormatFinanceValueCommand");
const FormatPercentValueCommand_1 = require("./commands/FormatPercentValueCommand");
const FormatPeriodChipCommand_1 = require("./commands/FormatPeriodChipCommand");
const FormatPeriodRangeCommand_1 = require("./commands/FormatPeriodRangeCommand");
const LabelPeriodQuarterCommand_1 = require("./commands/LabelPeriodQuarterCommand");
const LabelPeriodMonthCommand_1 = require("./commands/LabelPeriodMonthCommand");
const FormatMonthLabelToQuarterCommand_1 = require("./commands/FormatMonthLabelToQuarterCommand");
const FormatMonthLabelTitleCommand_1 = require("./commands/FormatMonthLabelTitleCommand");
const GetCountryMapCommand_1 = require("./commands/resource-allocation-media/GetCountryMapCommand");
const GetSegmentColorsCommand_1 = require("./commands/resource-allocation-media/GetSegmentColorsCommand");
const EnsureArrayCommand_1 = require("./commands/EnsureArrayCommand");
const ToNumberOrUndefinedCommand_1 = require("./commands/ToNumberOrUndefinedCommand");
const MarkAxisBreakCommand_1 = require("./commands/MarkAxisBreakCommand");
const FormatTimePeriodLabelCommand_1 = require("./commands/FormatTimePeriodLabelCommand");
const ResolveTimePeriodItemDateCommand_1 = require("./commands/ResolveTimePeriodItemDateCommand");
const registerHelpers = (expression) => {
    const commands = [
        new SafeNumberCommand_1.SafeNumberCommand(),
        new FormatValueCommand_1.FormatValueCommand(),
        new FormatSignedValueCommand_1.FormatSignedValueCommand(),
        new FormatPeriodCommand_1.FormatPeriodCommand(),
        new FormatCompactNumberCommand_1.FormatCompactNumberCommand(),
        new FormatDateToQuarterCommand_1.FormatDateToQuarterCommand(),
        new FormatDateToMonthCommand_1.FormatDateToMonthCommand(),
        new FormatLyPeriodCommand_1.FormatLyPeriodCommand(),
        new FormatFyPeriodCommand_1.FormatFyPeriodCommand(),
        new FormatYtdPeriodCommand_1.FormatYtdPeriodCommand(),
        new FormatLqQuarterCommand_1.FormatLqQuarterCommand(),
        new FormatLyQuarterCommand_1.FormatLyQuarterCommand(),
        new FormatCurrentPeriodCommand_1.FormatCurrentPeriodCommand(),
        new GetTrendCommand_1.GetTrendCommand(),
        new GetColorUpDownCommand_1.GetColorUpDownCommand(),
        new GetIndexColorCommand_1.GetIndexColorCommand(),
        new GetPerformanceColorCommand_1.GetPerformanceColorCommand(),
        new FormatFinanceValueCommand_1.FormatFinanceValueCommand(),
        new FormatPercentValueCommand_1.FormatPercentValueCommand(),
        new FormatPeriodChipCommand_1.FormatPeriodChipCommand(),
        new FormatPeriodRangeCommand_1.FormatPeriodRangeCommand(),
        new LabelPeriodQuarterCommand_1.LabelPeriodQuarterCommand(),
        new LabelPeriodMonthCommand_1.LabelPeriodMonthCommand(),
        new FormatMonthLabelToQuarterCommand_1.FormatMonthLabelToQuarterCommand(),
        new FormatMonthLabelTitleCommand_1.FormatMonthLabelTitleCommand(),
        new GetCountryMapCommand_1.GetCountryMapCommand(),
        new GetSegmentColorsCommand_1.GetSegmentColorsCommand(),
        new EnsureArrayCommand_1.EnsureArrayCommand(),
        new ToNumberOrUndefinedCommand_1.ToNumberOrUndefinedCommand(),
        new MarkAxisBreakCommand_1.MarkAxisBreakCommand(),
        new FormatTimePeriodLabelCommand_1.FormatTimePeriodLabelCommand(),
        new ResolveTimePeriodItemDateCommand_1.ResolveTimePeriodItemDateCommand(),
    ];
    commands.forEach((command) => {
        expression.registerFunction(command.name, command.execute.bind(command));
    });
};
exports.registerHelpers = registerHelpers;
//# sourceMappingURL=index.js.map