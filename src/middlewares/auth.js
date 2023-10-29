import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization'];

    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, accessSecret);

    if (!payload) return res.sendStatus(403);
    req.user = payload;

    next();
  } catch (error) {
    console.info('[ERROR_AUTH]', error);
    res.status(500).json({
      message: error,
    });
  }
};
