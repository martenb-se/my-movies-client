import { defineStore } from "pinia";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

/**
 * Store to hold global error messages for the user that can be seen on every page.
 */
export const useErrorMessageStore = defineStore({
  id: "errorMessage",
  state: () => ({
    _msgId: 0,
    message: [],
  }),
  actions: {
    /**
     * Add a new error message.
     * @param {string} newMessage The message contents.
     */
    addMessage(newMessage) {
      if (typeof newMessage !== "string") {
        throw new InvalidArgumentError(
          "Argument 'newMessage' must be a string!",
          "newMessage"
        );
      }

      this.message.push([this._msgId, new Date().toJSON(), newMessage]);
      this._msgId++;
    },
    /**
     * Remove an error message
     * @param {number} messageId The id of the message to remove.
     */
    removeMessage(messageId) {
      if (typeof messageId !== "number") {
        throw new InvalidArgumentError(
          "Argument 'messageId' must be a number!",
          "messageId"
        );
      }

      if (
        this.message.filter(([curMessageId, ,]) => curMessageId === messageId)
          .length === 0
      )
        throw new Error(
          "Error message with given 'messageId' being '" +
            messageId +
            "' does not exist!"
        );

      this.message = this.message.filter(
        ([curMessageId, ,]) => curMessageId !== messageId
      );
    },
  },
});
