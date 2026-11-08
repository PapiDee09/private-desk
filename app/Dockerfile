FROM node:22-alpine
WORKDIR /app
COPY server.mjs engine.mjs ./
COPY public ./public
USER node
EXPOSE 3105
CMD ["node", "server.mjs"]
