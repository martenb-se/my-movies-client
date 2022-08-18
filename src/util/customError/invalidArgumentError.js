class InvalidArgumentError extends Error {
  /**
   * Error for invalid arguments.
   * @param {string} message The error message.
   * @param {string} argument The affected argument.
   */
  constructor(message, argument) {
    super(message);
    this.name = "InvalidArgumentError";
    this.argument = argument;
  }
}

export default InvalidArgumentError;
