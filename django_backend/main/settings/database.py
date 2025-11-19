import os

DATABASES = {
    'default': {
        'ENGINE': os.getenv("ENGINE"),
        'NAME': os.getenv("NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("HOST"),
        'PORT': os.getenv("DB_PORT"),
    }
}
