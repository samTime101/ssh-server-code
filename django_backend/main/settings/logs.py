LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "server.log",
            "level": "DEBUG",
        },
        "console": {  
            "class": "logging.StreamHandler",
            "level": "DEBUG",
        },
    },
    "loggers": {
        "django.server": { 
            "level": "DEBUG",
            "handlers": ["file", "console"],
        },
    },
}
