import bcrypt from "bcrypt";

export const verifySecret = async (plainSecret, hashedSecret) => {
  return await bcrypt.compare(plainSecret, hashedSecret);
};

export const hashSecret = async (secret) => {
  return await bcrypt.hash(secret, 10);
};
