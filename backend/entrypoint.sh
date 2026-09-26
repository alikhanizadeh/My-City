#!/bin/sh
set -e

echo "در حال انتظار برای دیتابیس..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done
echo "دیتابیس آماده است."

echo "در حال ساخت فایل‌های migration (در صورت نیاز)..."
python manage.py makemigrations users categories reports --noinput

python manage.py migrate --noinput

# ساخت سوپریوزر اولیه در صورت نبود (اختیاری - seed اصلی کاربرها را می‌سازد)
python manage.py collectstatic --noinput || true

echo "در حال اجرای seed اولیه (در صورت خالی بودن دیتابیس)..."
python scripts/seed_data.py || true

echo "اجرای سرور..."
if [ "$DEBUG" = "True" ]; then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
