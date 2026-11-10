module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "ref", "fix", "docs", "test", "chore", "update", "conflict"],
    ],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
    "subject-full-stop": [0, "never"],
    "header-max-length": [2, "always", 72],
  },
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(feat|ref|fix|docs|test|chore|update|conflict):(.*)(\/\/KNBZ \d+)$/,
      headerCorrespondence: ["type", "subject", "ticket"],
    },
  },
};
