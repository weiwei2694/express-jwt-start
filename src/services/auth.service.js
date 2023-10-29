import tokenTypes from '../config/tokens.config.js';
import { generateToken, verifyToken } from './token.service.js';
import { getUserByEmail } from './user.service.js';
import db from '../../prisma/client.js';
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;
import moment from 'moment';

export const loginByEmailAndPassword = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) return null;

  return user;
};

export const refreshToken = async (token) => {
  const user = await verifyToken(token, tokenTypes.REFRESH);
  if (!user) return null;

  const { name, email, id: userId, role } = user;
  const dataUser = {
    name,
    email,
    userId,
    role,
  };

  const accessTokenExpires = moment().add(
    process.env.ACCESS_TOKEN_EXPIRED,
    'minutes'
  );
  const accessToken = await generateToken({
    user: dataUser,
    secret: process.env.ACCESS_TOKEN_SECRET,
    expired: accessTokenExpires,
    type: tokenTypes.ACCESS,
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

export const logout = async (token) => {
  const refreshToken = await db.token.findFirst({
    where: {
      token,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });

  if (!refreshToken) return null;

  return await db.token.update({
    where: {
      id: refreshToken.id,
    },
    data: {
      blacklisted: true,
    },
  });
};
