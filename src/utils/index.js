exports.randomString = async (length, customCharacter) => {
  const { customAlphabet } = await import("nanoid");
  const character = customCharacter ?? "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoId = customAlphabet(character, 10);
  return nanoId(length);
};
