FROM oven/bun:latest

COPY . /app

WORKDIR /app

RUN bun i

RUN bun vite build

CMD ["bun", "start"]
