FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests
COPY scripts ./scripts

CMD ["npm", "run", "test:pact:consumer"]
