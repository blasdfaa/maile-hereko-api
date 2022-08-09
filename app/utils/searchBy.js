export const searchBy = (prop, value) => (item) => {
  return value === '' ? item : item[prop].toLowerCase().includes(value);
};
