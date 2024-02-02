export const validateOnlyChacters = (name) => {
  const re = /^[a-zA-Z\ \s]+$/;
  return !re.test(name);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,}$/;

  return re.test(password);
};

  export const validateEmail = (email) => {
    const re =
      /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  };

export const validatePhone = (phone) => {
  const re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/; // only starting with 6789
  return re.test(phone);
};
