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

export const minutesToText = (minutes) => {
  const hours = Math.trunc(minutes / 60);
  const remainingMinutes = minutes % 60;

  let text = '';
  text += hours > 0 ? `${hours} hour` : '';
  text += hours > 1 ? 's' : '';
  text += hours > 0 ? ' ' : '';
  text += remainingMinutes > 0 ? `${remainingMinutes} minute` : '';
  text += remainingMinutes > 1 ? 's' : '';
  text += remainingMinutes > 0 ? ' ' : '';
  return text;
};
