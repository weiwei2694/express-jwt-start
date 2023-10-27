import { getUserByEmail } from './user.service.js';
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;

export const loginByEmailAndPassword = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) return null;

  return user;
};
