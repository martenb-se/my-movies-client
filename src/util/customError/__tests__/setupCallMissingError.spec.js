import { describe, it, expect } from "vitest";
import SetupCallMissingError from "@/util/customError/setupCallMissingError";

describe("Setup Call Missing Error", () => {
  it("should be of instance SetupCallMissingError", async () => {
    let caughtError;
    try {
      throw new SetupCallMissingError(
        "Method setUp() must first be called before execute() can be called!",
        "setUp()"
      );
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError).toBeInstanceOf(SetupCallMissingError);
  });

  it("should extend Error", async () => {
    let caughtError;
    try {
      throw new SetupCallMissingError(
        "Method setUp() must first be called before execute() can be called!",
        "setUp()"
      );
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError).toBeInstanceOf(Error);
  });

  it("should contain a name", async () => {
    let caughtError;
    try {
      throw new SetupCallMissingError(
        "Method setUp() must first be called before execute() can be called!",
        "setUp()"
      );
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.name).toBe("SetupCallMissingError");
  });

  it("should contain a call", async () => {
    let caughtError;
    try {
      throw new SetupCallMissingError(
        "Method setUp() must first be called before execute() can be called!",
        "setUp()"
      );
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.call).toBe("setUp()");
  });

  it("should contain a message", async () => {
    let caughtError;
    try {
      throw new SetupCallMissingError(
        "Method setUp() must first be called before execute() can be called!",
        "setUp()"
      );
    } catch (wantedError) {
      caughtError = wantedError;
    }
    expect(caughtError.message).toBe(
      "Method setUp() must first be called before execute() can be called!"
    );
  });
});
