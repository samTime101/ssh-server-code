# REFERENCE : https://docs.djangoproject.com/en/6.0/topics/logging/#id6
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "verbose": {
            "format": (
                "[{asctime}] {levelname} {name} "
                "{module}:{lineno} {funcName}() - {message}"
            ),
            "style": "{",
        },
    },

    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "server.log",
            "level": "DEBUG",
            "formatter": "verbose",
        },
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "verbose",
        },
    },

    "loggers": {
        "django.server": {
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["file", "console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}
