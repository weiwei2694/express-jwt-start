import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import ErrorHandler from './middlewares/error.middleware.js';
import cors from 'cors';
import corsOptions from './middlewares/cors.middleware.js';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import router from './routes/api/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV != 'test') {
  app.use(morgan('tiny'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(ErrorHandler);
app.use(cors(corsOptions));
app.use(helmet());
app.use(xss());
app.use(compression());

// Router
app.use(router);
// End Of Router

app.all('*', (req, res) => {
  return res.sendStatus(404);
});
app.use(ErrorHandler);
app.listen(PORT, () =>
  console.info(`Server listening on http://localhost:${PORT}`)
);
