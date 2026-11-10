import { NotFoundException } from "@nestjs/common";
import { ViewNotFoundError } from "@domain/exceptions/view-not-found.error";

describe("ViewNotFoundError", () => {
  it("should be an instance of NotFoundException", () => {
    const error = new ViewNotFoundError("test_view");
    expect(error).toBeInstanceOf(NotFoundException);
  });

  it("should create an error with viewName and set the correct message", () => {
    const viewName = "my_view";
    const error = new ViewNotFoundError(viewName);

    expect(error.message).toBe(`View '${viewName}' not found`);
    expect(error.name).toBe("ViewNotFoundError");
  });

  it("should create an error without viewName and set the default message", () => {
    const error = new ViewNotFoundError();

    expect(error.message).toBe("View not found");
    expect(error.name).toBe("ViewNotFoundError");
  });

  it("should set the name property to ViewNotFoundError", () => {
    const errorWithName = new ViewNotFoundError("test_view");
    const errorWithoutName = new ViewNotFoundError();

    expect(errorWithName.name).toBe("ViewNotFoundError");
    expect(errorWithoutName.name).toBe("ViewNotFoundError");
  });

  it("should inherit from NotFoundException and have HTTP status 404", () => {
    const error = new ViewNotFoundError("test_view");

    expect(error instanceof NotFoundException).toBe(true);
    expect(error.getStatus()).toBe(404);
  });

  it("should handle viewName with special characters", () => {
    const viewName = "my_view/with/slashes";
    const error = new ViewNotFoundError(viewName);

    expect(error.message).toBe(`View '${viewName}' not found`);
  });

  it("should handle empty string as viewName", () => {
    const error = new ViewNotFoundError("");

    expect(error.message).toBe("View not found");
  });

  it("should have the correct error response structure", () => {
    const error = new ViewNotFoundError("test_view");
    const response = error.getResponse();

    expect(response).toHaveProperty("statusCode", 404);
    expect(response).toHaveProperty("message");
  });
});
