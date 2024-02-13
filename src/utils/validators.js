export const validateOnlyChacters = (name) => {
  const re = /^[a-zA-Z\ \s]+$/;
  return !re.test(name);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,}$/;

  return re.test(password);
};

  export const validateEmail = (email) => {
    // const re =
    //   /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    // const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // email changes min 6 
    const re = /^[a-zA-Z0-9._-]{6,254}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // email changes min 6 and max 254 characters
    // const re = /^(?=.{1,254}$)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // email changes with max 254 and min 6 chars
    return re.test(email);
  };

export const validatePhone = (phone) => {
  const re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/; // only starting with 6789
  return re.test(phone);
};

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{1,30}$/; // max 30 chars
  return re.test(username);
};
