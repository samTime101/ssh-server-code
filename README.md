![Author](https://img.shields.io/badge/author-samip--regmi-blue)

---

> [!NOTE]  
> APP PROJECT TUTORIAL FOLLOWED FROM [HERE](https://www.geeksforgeeks.org/reactjs/how-to-connect-django-with-reactjs/)

## TO RUN PROJECT

```
git clone https://github.com/samTime101/project_structure.git
cd project_structure
```

## VIRTUAL ENV

```
python3 -m venv <envname>
source <envname>/bin/activate
```

## REQUIREMENTS(DJANGO)

```
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework
pip install dj-rest-auth
pip install djangorestframework-simplejwt
pip install PyJWT  
pip install mongoengine
pip install pymongo (MIGHT COME PRE INSTALLED WITH MONGOENGINE BUT DO IT)
pip install dnspython (MIGHT COME PRE INSTALLED WITH MONGOENGINE BUT DO IT)
INSTALL MONGODB ANS START IT (FOR WINDOWS , I AM USING LINUX SO I ALREADY HAVE IT) 
```

## REQUIREMENTS(FRONTEND)

```
cd react_frontend
npm install
```

## DATABASE
```
python3 manage.py makemigrations sqldb_app
python3 manage.py migrate
python3 manage.py createsuperuser
START MONGODB
```

> [!TIP]
> ADD A SUPERUSER TO SEE DATA IN FRONTEND


## DJANGO SERVER

**directory:`project_structure/`**

```
python3 manage.py runserver
```

## FRONT END 

**directory:`react_frontend/`**

```
npm run 
```

