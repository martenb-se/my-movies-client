import { describe, it, expect } from "vitest";
import { getEnumByName } from "@/util/enumHandling";

describe("Enum Handling", () => {
  describe("when a good Enum object is used", () => {
    const GoodEnum = Object.freeze({
      FOO: { name: "foo" },
      BAR: { name: "bar" },
      BAZ: { name: "baz" },
    });

    it("should be possible to find enum by name if it exists", async () => {
      const foundEnum = getEnumByName(GoodEnum, "foo");
      expect(foundEnum).toBe(GoodEnum.FOO);
    });

    it("should return an empty object if the name does not exist", async () => {
      const foundEnum = getEnumByName(GoodEnum, "gazonk");
      expect(foundEnum).toEqual({});
    });

    it("should not be possible to search if 'enumName' is not a string", async () => {
      expect(() => getEnumByName(GoodEnum, 123)).toThrowError(
        "Enum name must be a string."
      );
    });
  });

  it("should not be possible to search if any entry in 'enumObject' does not contain the 'name' key", async () => {
    const BadEnumWhereEntryIsMissingName = Object.freeze({
      FOO: { name: "foo" },
      BAR: { bad: "bad" },
      BAZ: { name: "baz" },
    });

    expect(() =>
      getEnumByName(BadEnumWhereEntryIsMissingName, "foo")
    ).toThrowError("All entries in the 'enumObject' must have the 'name' key");
  });

  it("should not be possible to search if any entry in 'enumObject' does not have a string value for its 'name' key", async () => {
    const BadEnumWhereEntryNameIsNotString = Object.freeze({
      FOO: { name: "foo" },
      BAR: { name: 123 },
      BAZ: { name: "baz" },
    });

    expect(() =>
      getEnumByName(BadEnumWhereEntryNameIsNotString, "foo")
    ).toThrowError("Key 'name' in enumObject[BAR] must be a string");
  });

  it("should not be possible to search if any two entries in 'enumObject' have identical values for their 'name' keys", async () => {
    const BadEnumWhereEntryNameIsNotString = Object.freeze({
      FOO: { name: "foo" },
      BAR: { name: "foo" },
      BAZ: { name: "baz" },
    });

    expect(() =>
      getEnumByName(BadEnumWhereEntryNameIsNotString, "foo")
    ).toThrowError(
      "enumObject contains at least two entries (enumObject[FOO], enumObject[BAR]) with identical 'name' keys. " +
        "'name' keys must be unique."
    );
  });
});
