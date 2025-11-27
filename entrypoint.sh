#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL..."
while ! nc -z $HOST $DB_PORT 2>/dev/null; do
  sleep 1
done
echo "MySQL is ready!"

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
while ! nc -z mongo 27017 2>/dev/null; do
  sleep 1
done
echo "MongoDB is ready!"

# Run migrations
echo "Running makemigrations..."
python manage.py makemigrations

echo "Running migrate..."
python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser if needed..."
python manage.py shell << END
from sql.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123',
        user_guid='00000000-0000-0000-0000-000000000000'
    )
    print("Superuser 'admin' created!")
else:
    print("Superuser 'admin' already exists.")
END

# Start gunicorn
echo "Starting Django application..."
exec gunicorn main.wsgi:application --bind 0.0.0.0:8000
