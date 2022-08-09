export const filterBy = (prop, value) => (item) => {
  return value === '' ? item : item[prop] === value;
};
