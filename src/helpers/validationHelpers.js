export const isFieldValid = (field) => {
  if (field.trim() === "") {
    return false;
  } else {
    return true;
  }
};

export const isFieldExceedMaxChar = (field, maxChar) => {
  return field.length > maxChar;
};
