let counter = 0;

export const createId = () => {
  counter += 1;
  return Date.now() + counter;
};
