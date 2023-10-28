import tokenTypes from '../config/tokens.config.js';
import { generateAuthTokens, verifyToken } from './token.service.js';
import { getUserByEmail, getUserById } from './user.service.js';
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;
import db from '../../prisma/client.js';

export const loginByEmailAndPassword = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) return null;

  return user;
};

export const refreshToken = async (token) => {
  try {
    const refreshTokenDoc = await verifyToken(token, tokenTypes.REFRESH);

    const user = await getUserById(refreshTokenDoc.userId);

    await db.token.delete({
      where: { id: refreshTokenDoc.id },
    });

    return generateAuthTokens(user);
  } catch (error) {
    console.info('[ERROR_REFRESH_TOKEN]', error);
  }
};
