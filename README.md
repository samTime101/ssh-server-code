![Author](https://img.shields.io/badge/author-samip--regmi-blue)

---

> [!NOTE]  
> APP PROJECT TUTORIAL FOLLOWED FROM [HERE](https://www.geeksforgeeks.org/reactjs/how-to-connect-django-with-reactjs/)

## TO RUN PROJECT

> [!NOTE]  
> PLEASE SET THE REQUIRED ENVIRONMENT VARIABLES TO EXECUTE BACKEND

```sh
git clone <remote-url>
cd sisani-eps
```

### VIRTUAL ENV

```sh
python3 -m venv <envname>
source <envname>/bin/activate
```

### INSTALL REQUIRED SYSTEM DEPENDENCIES FOR SQL

```sh
apt-get update -y
apt-get install -y python3-dev build-essential
apt-get install -y default-libmysqlclient-dev
```

### REQUIREMENTS(DJANGO)

```sh
pip install -r requirements.txt
```

### DATABASE

```sh
python3 manage.py makemigrations sql
python3 manage.py migrate
python3 manage.py createsuperuser
```

> [!TIP]
> ADD A SUPERUSER TO SEE DATA IN FRONTEND


### DJANGO SERVER

**directory:`django_backend/`**

```sh
python3 manage.py runserver
```



--- 



## DOCKER

### BUILD THE IMAGE

```sh
docker build -t sisani-eps-web .
```

### RUN THE IMAGE AND CREATE CONTAINER

```sh
docker run --env-file .env -p 8000:8000 --name sisani-web-container sisani-eps-web
```


## TESTS

### EXECULTE TESTS

```sh

python manage.py test
or 
python manage.py test <appname>
```

## BACKEND FOLDER STRUCTURE

```
django_backend/
    api/
    -----apps/

    core/
    -----validators, mixins and helper func

    main/
    ------main project

    sql/
    -------models for sql

    mongo/
    --------models for mongo

```


## VPS CONFIGURATION

fronedn build path: `/var/www/react_frontend/`

nginx config path: `/etc/nginx/sites-available/react_django.conf`

supervisor config path: `/etc/supervisor/conf.d/django_backend.conf`


## RESTART NGINX CONFIG

```sh
ln -s /etc/nginx/sites-available/react_django.conf /etc/nginx/sites-enabled/
systemctl restart nginx
nginx -t
```

## RESTART SUPERVISOR CONFIG

```sh
supervisorctl reread
supervisorctl update
supervisorctl restart django_backend
```