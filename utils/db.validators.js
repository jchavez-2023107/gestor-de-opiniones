//Validar datos relacionados a la BD

import User from "../src/users/user.model.js";

export const existUsername = async (username) => {
  const alreadyUsername = await User.findOne({ username });
  if (alreadyUsername) {
    console.error(`Username ${username} is already taken`);
    throw new Error(`Username ${username} is already taken`);
  }
};

export const existEmail = async (email) => {
  const alreadyEmail = await User.findOne({ email });
  if (alreadyEmail) {
    console.error(`Email ${email} is already taken`);
    throw new Error(`Email ${email} is already taken`);
  }
};
