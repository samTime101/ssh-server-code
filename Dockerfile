# https://www.docker.com/blog/how-to-dockerize-django-app/


# THE ABOVE LINK WAS USING OLD SO I FOUND A NEWER VERSION
# https://hub.docker.com/_/python/
FROM python:3.14.0rc3-slim-trixie 

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
# https://stackoverflow.com/questions/76531899/using-mysqlclient-in-docker
# I WAS RUNNING DOCKER BUILD BUT IT WAS COMPLAINING ABOUT MISSING DEPENDENCIES FOR MYSQLCLIENT
# ANSWER REFERENCE FROM ABOVE STACKOVERFLOW LINK
RUN apt-get update -y
# RUN apt-get install -y python3-dev build-essential
# RUN apt-get install -y default-libmysqlclient-dev
# IT THEN STARTED COMPLAINING ABOUT PKG-CONFIG THEN WITH BELOW ANSWER I INSTALLED ALL THE DEPENDENCIES AT ONCE
# RUN apt-get install -y pkg-config

# https://stackoverflow.com/questions/76585758/mysqlclient-cannot-install-via-pip-cannot-find-pkg-config-name-in-ubuntu
# CERTIFICATE ISSUE WHILE CONNECTING TO MONGODB ATLAS FROM DOCKER CONTAINER SO I INSTALLED CA-CERTIFICATES
RUN apt-get install -y pkg-config python3-dev default-libmysqlclient-dev build-essential libpq-dev ca-certificates

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./django_backend .  

EXPOSE 8000

CMD ["gunicorn", "main.wsgi:application", "--bind", "0.0.0.0:8000"]

# asgi chai async raixa
# CMD ["uvicorn", "main.asgi:application", "--host", "0.0.0.0","--port","8000"]
