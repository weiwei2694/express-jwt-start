import { getUsers } from '../services/user.service.js';

export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.info('[ERROR_GET_USERS_CONTROLLER]', error);
    res.status(500).json({
      message: error,
    });
  }
};
