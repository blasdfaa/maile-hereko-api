export const formatValidationMessage = ({ msg }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return { ...msg };
};

export const formatQueryValidationMessage = ({ location, msg, param }) => {
  return `${location} [${param}]: ${msg}`;
};
