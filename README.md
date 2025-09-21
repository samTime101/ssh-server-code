![Author](https://img.shields.io/badge/author-samip--regmi-blue)

---

> [!NOTE]  
> APP PROJECT TUTORIAL FOLLOWED FROM [HERE](https://www.geeksforgeeks.org/reactjs/how-to-connect-django-with-reactjs/)

## TO RUN PROJECT

```sh
git clone https://github.com/samTime101/project_structure.git
cd sisani-eps
```

## VIRTUAL ENV

```sh
python3 -m venv <envname>
source <envname>/bin/activate
```


## INSTALL REQUIRED SYSTEM DEPENDENCIES FOR SQL

```sh
apt-get update -y
apt-get install -y python3-dev build-essential
apt-get install -y default-libmysqlclient-dev
```

## REQUIREMENTS(DJANGO)

```sh
pip install -r requirements.txt
```

## DATABASE

```sh
python3 manage.py makemigrations sqldb_app
python3 manage.py migrate
python3 manage.py createsuperuser
```

> [!TIP]
> ADD A SUPERUSER TO SEE DATA IN FRONTEND


## DJANGO SERVER

**directory:`django_backend/`**

```sh
python3 manage.py runserver
```



--- 



# DOCKER

## BUILD THE IMAGE

```sh
docker build -t sisani-eps-web .
```

## RUN THE IMAGE AND CREATE CONTAINER

```sh
docker run --env-file .env -p 8000:8000 --name sisani-web-container sisani-eps-web
```
