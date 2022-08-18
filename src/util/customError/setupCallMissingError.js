class SetupCallMissingError extends Error {
  /**
   * Error for when a necessary set-up call has not yet been performed.
   * @param {string} message The error message.
   * @param {string} call The necessary set-up call.
   */
  constructor(message, call) {
    super(message);
    this.name = "SetupCallMissingError";
    this.call = call;
  }
}

export default SetupCallMissingError;
