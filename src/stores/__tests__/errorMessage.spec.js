import { describe, it, expect, beforeEach } from "vitest";

import { setActivePinia, createPinia } from "pinia";
import { useErrorMessageStore } from "@/stores/errorMessage";

import InvalidArgumentError from "@/util/customError/invalidArgumentError";

describe("Error Message Store", () => {
  let errorMessageStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    errorMessageStore = useErrorMessageStore();
  });

  it("should have no messages at initialization", async () => {
    expect(Object.keys(errorMessageStore.message).length).toBe(0);
    expect(errorMessageStore._msgId).toBe(0);
  });

  it("should be possible to add a message", async () => {
    const errorMessage = "Test Error";

    expect(Object.keys(errorMessageStore.message).length).toBe(0);
    expect(errorMessageStore._msgId).toBe(0);
    errorMessageStore.addMessage(errorMessage);
    expect(Object.keys(errorMessageStore.message).length).toBe(1);
    expect(errorMessageStore._msgId).toBe(1);
    expect(errorMessageStore.message[0][2]).toBe(errorMessage);
  });

  it("should not be possible to add a message when 'newMessage' is not a string", async () => {
    const errorMessage = 9124;

    expect(Object.keys(errorMessageStore.message).length).toBe(0);
    expect(errorMessageStore._msgId).toBe(0);

    try {
      errorMessageStore.addMessage(errorMessage);
    } catch (thrownError) {
      expect(thrownError).toBeInstanceOf(InvalidArgumentError);
      expect(thrownError.message).toBe(
        "Argument 'newMessage' must be a string!"
      );
    }

    expect(Object.keys(errorMessageStore.message).length).toBe(0);
    expect(errorMessageStore._msgId).toBe(0);
  });

  describe("when an error message is in the store", () => {
    beforeEach(() => {
      errorMessageStore.addMessage("Sample Error #1");
    });

    it("error messages should have an id that is a number", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      expect(errorMessageStore.message[0][0]).toBeTypeOf("number");
    });

    it("error messages should have a correct id", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      expect(errorMessageStore.message[0][0]).toBe(
        errorMessageStore._msgId - 1
      );
    });

    it("error messages should have a timestamp that is a string", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      expect(errorMessageStore.message[0][1]).toBeTypeOf("string");
    });

    it("error messages should have a timestamp in JSON that parsable and can be reconverted to JSON date", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      const parsedTimestamp = new Date(errorMessageStore.message[0][1]);
      expect(errorMessageStore.message[0][1]).toBe(parsedTimestamp.toJSON());
    });

    it("should be possible to remove an error message", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      errorMessageStore.removeMessage(0);
      expect(Object.keys(errorMessageStore.message).length).toBe(0);
    });

    it("internal id should not change when removing a message", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);
      expect(errorMessageStore._msgId).toBe(1);
      errorMessageStore.removeMessage(0);
      expect(Object.keys(errorMessageStore.message).length).toBe(0);
      expect(errorMessageStore._msgId).toBe(1);
    });

    it("should not be possible to remove an error message when the given id is not a number", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);

      try {
        errorMessageStore.removeMessage("one");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Argument 'messageId' must be a number!"
        );
      }

      expect(Object.keys(errorMessageStore.message).length).toBe(1);
    });

    it("should not be possible to remove an error message when the given id does not match anything", async () => {
      expect(Object.keys(errorMessageStore.message).length).toBe(1);

      try {
        errorMessageStore.removeMessage(1);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toBe(
          "Error message with given 'messageId' being '1' does not exist!"
        );
      }

      expect(Object.keys(errorMessageStore.message).length).toBe(1);
    });
  });
});
