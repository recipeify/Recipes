/**
 * Generates a random 4B string that can be used as a key.
 */
// eslint-disable-next-line import/prefer-default-export
export const getRandomID = () => {
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return `${id}`;
};
