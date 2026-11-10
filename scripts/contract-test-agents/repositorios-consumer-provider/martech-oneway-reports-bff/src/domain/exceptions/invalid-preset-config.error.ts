export class InvalidPresetConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPresetConfigError";
  }
}
