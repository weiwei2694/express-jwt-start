import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];

  if (token === null) return res.sendStatus(401);

  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, accessSecret, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
