export class PresetNotFoundError extends Error {
  constructor(message = "Preset not found") {
    super(message);
    this.name = "PresetNotFoundError";
  }
}
