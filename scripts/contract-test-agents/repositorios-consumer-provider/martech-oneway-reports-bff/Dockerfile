FROM node:lts-alpine
WORKDIR /app

# Essential environment variables
ARG NODE_ENV
ARG APP_PORT

ENV NODE_ENV=$NODE_ENV
ENV APP_PORT=$APP_PORT

EXPOSE ${APP_PORT}

COPY . .

# Install all dependencies for build
RUN npm ci && npm cache clean --force

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

CMD ["npm", "run", "start:prod"]
