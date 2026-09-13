FROM node:20-bullseye-slim

RUN useradd -ms /bin/bash womuser

WORKDIR /home/womuser/app

RUN apt-get update && apt-get install -y --no-install-recommends cron && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN corepack pnpm install --frozen-lockfile --prod

COPY . .
# COPY create-comps-cron /etc/cron.d/create-comps-cron
# RUN chmod 0644 /etc/cron.d/create-comps-cron

# CMD ["cron", "-f"]
CMD ["sleep", "infinity"]