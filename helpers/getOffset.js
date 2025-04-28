export const getOffset = (page = 1, limit = 100) => {
  return (page - 1) * limit;
};
