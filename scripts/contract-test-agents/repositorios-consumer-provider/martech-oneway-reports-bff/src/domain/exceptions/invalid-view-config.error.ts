import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidViewConfigError extends UnprocessableEntityException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidViewConfigError";
  }
}
