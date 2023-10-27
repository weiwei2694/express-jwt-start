import db from '../../prisma/client.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import tokenTypes from '../config/tokens.config.js';

export const generateToken = async ({ user, secret, expired, type }) => {
  try {
    if (!user) throw new Error('User not found');
    if (!secret) throw new Error('Secret not found');
    if (!expired) throw new Error('Expired not found');

    const payload = {
      sub: user,
      iat: moment().unix(),
      exp: expired.unix(),
      type,
    };

    return jwt.sign(payload, secret);
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

    const tokenDoc = await db.token.create({
      data: {
        token,
        userId,
        expires: expired.toDate(),
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
  const { name, email, id } = user;

  if (!name) throw new Error('name not found');
  if (!email) throw new Error('email not found');
  if (!id) throw new Error('id not found');

  const dataUser = {
    userId: id,
    name,
    email,
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

  const refreshTokenExpires = moment().add(
    process.env.REFRESH_TOKEN_EXPIRED,
    'days'
  );
  const refreshToken = await generateToken({
    user: dataUser,
    secret: process.env.REFRESH_TOKEN_SECRET,
    expired: refreshTokenExpires,
    type: tokenTypes.REFRESH,
  });

  console.info(refreshToken);

  await saveToken({
    token: refreshToken,
    userId: id,
    expired: refreshTokenExpires,
    type: tokenTypes.REFRESH,
  });

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
