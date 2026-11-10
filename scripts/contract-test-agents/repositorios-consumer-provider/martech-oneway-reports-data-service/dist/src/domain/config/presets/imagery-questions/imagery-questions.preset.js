"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imagery_questions_handler_1 = require("./imagery-questions.handler");
const imageryQuestionsPreset = {
    imagery_questions: {},
};
const config = {
    version: "1.0.0",
    filters: [
        { name: "country", required: true },
        { name: "subbrand", required: true },
        { name: "dt_end", required: true },
    ],
    handler: imagery_questions_handler_1.imageryQuestionsHandler,
    preset: imageryQuestionsPreset,
};
exports.default = config;
//# sourceMappingURL=imagery-questions.preset.js.map