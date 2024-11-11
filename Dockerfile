FROM oven/bun:latest

COPY . /app

WORKDIR /app

RUN bun install

RUN bun run build

CMD ["bun", "run", "start"]
