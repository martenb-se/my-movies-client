import InvalidArgumentError from "@/util/customError/invalidArgumentError";

/**
 * Search within an enum object for a given name.
 * @param {Readonly<{}>} enumObject The enum object that contains ALL CAPS keys,
 * containing objects with at least the 'name' property in order for them to be identified.
 * @param {string} enumName The name to search for in the enum object.
 * @returns {{name: string} | {}} The object containing the name if found, otherwise an empty object.
 */
const getEnumByName = (enumObject, enumName) => {
  if (
    enumName === undefined ||
    (typeof enumName === "string" && enumName.length === 0)
  )
    return {};

  if (typeof enumName !== "string")
    throw new InvalidArgumentError("Enum name must be a string.", "enumName");

  Object.keys(enumObject).reduce((foundKeys, key) => {
    if (!Object.prototype.hasOwnProperty.call(enumObject[key], "name"))
      throw new InvalidArgumentError(
        "All entries in the 'enumObject' must have the 'name' key",
        "enumObject"
      );
    else if (typeof enumObject[key].name !== "string")
      throw new InvalidArgumentError(
        "Key 'name' in enumObject[" + key + "] must be a string",
        "enumObject[" + key + "]"
      );
    else if (
      Object.prototype.hasOwnProperty.call(foundKeys, enumObject[key].name)
    )
      throw new InvalidArgumentError(
        "enumObject contains at least two entries (enumObject[" +
          foundKeys[enumObject[key].name] +
          "], enumObject[" +
          key +
          "]) with identical 'name' keys. 'name' keys must be unique.",
        "enumObject[" +
          foundKeys[enumObject[key].name] +
          "], enumObject[" +
          key +
          "]"
      );

    foundKeys[enumObject[key].name] = key;
    return foundKeys;
  }, {});

  return Object.keys(enumObject).reduce((res, key) => {
    if (enumObject[key].name === enumName) return enumObject[key];
    else return res;
  }, {});
};

export { getEnumByName };
