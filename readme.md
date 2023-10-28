# Express Jwt: Express, Jsonwebtoken, Prisma, MySQL

practice creating a jsonwebtoken using express

## Cloning the repository

```bash
git clone https://github.com/weiwei2694/express-jwt-start.git
cd express-jwt-start
```

## Install packages

```bash
npm install
```

## Setup .env file

```
# SERVER
PORT=8000

# JWT
ACCESS_TOKEN_SECRET=access_token_secret
ACCESS_TOKEN_EXPIRED=30
REFRESH_TOKEN_SECRET=refresh_token_secret
REFRESH_TOKEN_EXPIRED=30

# DATABASE
DATABASE_URL=
```

## Setup Prisma

Add MySQL Database

```bash
npx prisma generate
npx prisma db push
```

## Available commands

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Starts a development instance of the app |
| `npm run prettier`     | Check and format code using Prettier     |
| `npm run prettier:fix` | Format code using Prettier (fix issues)  |
