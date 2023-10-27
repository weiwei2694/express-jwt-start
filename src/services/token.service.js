import db from '../../prisma/client.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import tokenTypes from '../config/tokens.config.js';

export const generateToken = async (user, secret, expired) => {
  try {
    if (!user) throw new Error('User not found');
    if (!secret) throw new Error('Secret not found');
    if (!expired) throw new Error('Expired not found');

    return jwt.sign(user, secret, { expiresIn: expired });
  } catch (error) {
    console.info('[ERROR_GENERATE_TOKEN]', error);
  }
};

export const saveToken = async ({
  token,
  userId,
  expired,
  type,
  blacklisted = false,
}) => {
  try {
    if (!token) throw new Error('token not found');
    if (!userId) throw new Error('userId not found');
    if (!expired) throw new Error('expired not found');
    if (!type) throw new Error('type not found');
    if (!blacklisted) throw new Error('blacklisted not found');

    const tokenDoc = await db.token.create({
      data: {
        token,
        userId,
        expires: expired,
        type,
        blacklisted,
      },
    });

    return tokenDoc;
  } catch (error) {
    console.info('[ERROR_SAVE_TOKEN]', error);
  }
};

export const generateAuthTokens = async (user) => {
  const { name, username, id } = user;

  if (!name) throw new Error('name not found');
  if (!username) throw new Error('username not found');
  if (!id) throw new Error('id not found');

  const dataUser = {
    userId: id,
    name,
    username,
  };

  const accessTokenExpires = moment().add(
    process.env.ACCESS_TOKEN_EXPIRED,
    'minutes'
  );
  const accessToken = generateToken(
    dataUser,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    process.env.REFRESH_TOKEN_EXPIRED,
    'days'
  );
  const refreshToken = generateToken(
    dataUser,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(refreshToken, id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
