const validator = require("validator");

const validateSignUpData = (req) => {
  console.log(req.body);

  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName && !lastName && !emailId && !password) {
    throw new Error("Please enter details to proceed!");
  } else if (
    !validator.isAlpha(firstName) ||
    firstName.length < 3 ||
    firstName.length > 50 ||
    !validator.isAlpha(lastName) ||
    lastName.length < 3 ||
    lastName.length > 50
  ) {
    throw new Error(
      "Minimum 3 to maximum 50 alphabet only characters required in first name and Last name."
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email: Please enter a valid email.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Invalid password: Must contain 8+ characters with at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    // "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid Edit Request");
  }

  const errors = [];

  // Check firstName if present
  if (req.body.firstName !== undefined) {
    if (!validator.isAlpha(req.body.firstName) || 
        req.body.firstName.length < 3 || 
        req.body.firstName.length > 50) {
      errors.push("First name must contain 3-50 alphabetical characters only.");
    }
  }

  // Check lastName if present
  if (req.body.lastName !== undefined) {
    if (!validator.isAlpha(req.body.lastName) || 
        req.body.lastName.length < 3 || 
        req.body.lastName.length > 50) {
      errors.push("Last name must contain 3-50 alphabetical characters only.");
    }
  }

  // Check emailId if present
  // if (req.body.emailId !== undefined) {
  //   if (!validator.isEmail(req.body.emailId)) {
  //     errors.push("Please provide a valid email address.");
  //   }
  // }

  // Check photoUrl if present
  if (req.body.photoUrl !== undefined) {
    if (!isValidPhotoUrl(req.body.photoUrl)) {
      errors.push("Please provide a valid photo URL.");
    }
  }

  // Check gender if present
  if (req.body.gender !== undefined) {
    const validGenders = ["male", "female", "others"];
    if (!validGenders.includes(req.body.gender.toLowerCase())) {
      errors.push("Gender must be one of: male, female, other.");
    }
  }

  // Check age if present
  if (req.body.age !== undefined) {
    const age = parseInt(req.body.age);
    if (isNaN(age) || age < 18 || age > 120) {
      errors.push("Age must be a number between 18 and 120.");
    }
  }

  // Check about if present
  if (req.body.about !== undefined) {
    if (req.body.about.length > 500) {
      errors.push("About section cannot exceed 500 characters.");
    }
  }

  // Check skills if present
  // if (req.body.skills !== undefined) {
  //   if (!Array.isArray(req.body.skills)) {
  //     errors.push("Skills must be provided as an array.");
  //   } else {
  //     // Check each skill
  //     for (const skill of req.body.skills) {
  //       if (typeof skill !== 'string' || skill.length < 1 || skill.length > 50) {
  //         errors.push("Each skill must be a string between 1-50 characters.");
  //         break;
  //       }
  //     }
  //   }
  // }

  // If any errors were found, throw them
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return;
};

//helper to validate photo URL
function isValidPhotoUrl(url) {
  try {
    new URL(url);
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return validImageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  } catch (e) {
    return false;
  }
};

module.exports = {
  validateEditProfileData,
  validateSignUpData,
};
