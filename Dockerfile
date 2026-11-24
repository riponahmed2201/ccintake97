FROM php:8.4-cli-bookworm AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip curl ca-certificates xz-utils libonig-dev \
    && docker-php-ext-install mbstring \
    && curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && curl -fsSL https://nodejs.org/dist/v22.23.5/node-v22.23.5-linux-x64.tar.xz \
        | tar -xJ -C /usr/local --strip-components=1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --prefer-dist --no-autoloader

COPY . .
RUN composer dump-autoload --optimize --no-dev --no-scripts \
    && cp .env.example .env \
    && mkdir -p storage/framework/views storage/framework/cache/data storage/framework/sessions storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && php artisan key:generate --force --no-interaction \
    && php artisan package:discover --ansi \
    && php artisan wayfinder:generate --with-form --no-interaction \
    && npm ci \
    && npm run build \
    && rm -rf node_modules .env

FROM dunglas/frankenphp:1-php8.4 AS runtime

RUN install-php-extensions pdo_mysql gd intl zip bcmath \
    && printf '%s\n' \
        'memory_limit=256M' \
        'upload_max_filesize=12M' \
        'post_max_size=12M' \
        'max_execution_time=60' \
        'opcache.validate_timestamps=0' \
        > "$PHP_INI_DIR/conf.d/app.ini"

WORKDIR /app
COPY --from=build /app /app

COPY <<'EOF' /usr/local/bin/start-app
#!/bin/sh
set -e
cd /app
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs storage/app/public bootstrap/cache
chmod -R a+rwx storage bootstrap/cache
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is empty. Put a key in .env before starting the container." >&2
    exit 1
fi
php artisan storage:link || true
php artisan config:cache
php artisan view:cache
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi
exec docker-php-entrypoint "$@"
EOF

RUN chmod +x /usr/local/bin/start-app

ENV SERVER_NAME=:80
ENTRYPOINT ["/usr/local/bin/start-app"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
