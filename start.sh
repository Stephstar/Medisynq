#!/bin/bash

echo "Running makemigrations..."
python manage.py makemigrations

echo "Running migrate..."
python manage.py migrate --noinput

echo "Running collectstatic..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
gunicorn medisynq_backend.wsgi:application