FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm@9.14.2 \
	&& pnpm install --frozen-lockfile \
	&& pnpm build

EXPOSE 8000
CMD ["pnpm", "start"]
