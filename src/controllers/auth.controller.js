import tokenTypes from '../config/tokens.config.js';
import {
  loginByEmailAndPassword,
  logout,
  refreshToken,
} from '../services/auth.service.js';
import {
  generateAuthTokens,
  getRefreshToken,
  verifyToken,
} from '../services/token.service.js';
import { createNewUser, getUserByEmail } from '../services/user.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = await loginByEmailAndPassword({ email, password });
    const tokens = await generateAuthTokens(user);

    res.cookie('refreshToken', tokens.refresh.token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        user,
        tokens,
      },
    });
  } catch (error) {
    console.info('[ERROR_LOGIN]', error);
    res.status(500).json({
      message: error,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        messaage: 'email already taken',
      });
    }

    const newUser = await createNewUser({ name, email, password });

    res.status(201).json({
      data: newUser,
    });
  } catch (error) {
    console.info('[ERROR_REGISTER]', error);
    res.status(500).json({
      message: error,
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.body.refreshToken;

    const existingToken = await getRefreshToken(token);
    if (!existingToken) return res.sendStatus(401);

    const user = await verifyToken(token, tokenTypes.REFRESH);
    if (!user) return res.sendStatus(401);

    const tokens = await refreshToken(token);
    res.status(200).json({ data: tokens });
  } catch (error) {
    console.info('[ERROR_REFRESH_TOKEN_CONTROLLER]', error);
    res.send(500).json({
      message: error,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.body.refreshToken;

    const existingToken = await getRefreshToken(token);
    if (!existingToken) return res.sendStatus(401);

    const user = await verifyToken(token, tokenTypes.REFRESH);
    if (!user) return res.sendStatus(401);

    await logout(token);

    res.sendStatus(200);
  } catch (error) {
    console.info('[ERROR_LOGOUT_CONTROLLER]', error);
    res.send(500).json({
      message: error,
    });
  }
};
