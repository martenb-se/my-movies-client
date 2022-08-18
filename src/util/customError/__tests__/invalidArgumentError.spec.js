import { describe, it, expect } from "vitest";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

describe("Invalid Argument Error", () => {
  it("should be of instance InvalidArgumentError", async () => {
    let caughtError;
    try {
      throw new InvalidArgumentError("Argument 'test' is wrong!", "test");
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError).toBeInstanceOf(InvalidArgumentError);
  });

  it("should extend Error", async () => {
    let caughtError;
    try {
      throw new InvalidArgumentError("Argument 'test' is wrong!", "test");
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError).toBeInstanceOf(Error);
  });

  it("should contain a name", async () => {
    let caughtError;
    try {
      throw new InvalidArgumentError("Argument 'test' is wrong!", "test");
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.name).toBe("InvalidArgumentError");
  });

  it("should contain an argument", async () => {
    let caughtError;
    try {
      throw new InvalidArgumentError("Argument 'test' is wrong!", "test");
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.argument).toBe("test");
  });

  it("should contain a message", async () => {
    let caughtError;
    try {
      throw new InvalidArgumentError("Argument 'test' is wrong!", "test");
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.message).toBe("Argument 'test' is wrong!");
  });
});
