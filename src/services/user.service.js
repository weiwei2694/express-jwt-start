import bcrypt from 'bcryptjs';
const { hash } = bcrypt;
import db from '../../prisma/client.js';

export const getUserByEmail = async (email) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.info('[ERROR_GET_USER_BY_EMAIL]', error);
  }
};

export const createNewUser = async ({ name, email, password }) => {
  try {
    const hashPassword = await hash(password, 8);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    return newUser;
  } catch (error) {
    console.info('[CREATE_NEW_USER]', error);
  }
};

export const getUsers = async () => {
  return await db.user.findMany({});
};

export const getUserById = async (id) => {
  return await db.user.findFirst({
    where: {
      id,
    },
  });
};
