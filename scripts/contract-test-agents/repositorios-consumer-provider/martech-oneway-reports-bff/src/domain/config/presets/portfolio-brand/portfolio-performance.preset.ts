import { PresetConfig } from "@domain/entities/preset.entity";
import { buildTimeFrameFilters } from "../common/time-frame.builder";

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    zones: {},
    country: {},
    "ytd-month": {},
    ...buildTimeFrameFilters(),
  },
};

export default config;
