import os


# TODO: handle fastapi settings with env
class Settings:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    LOGS_DIR = f"{BASE_DIR}/logs"
    ASSETS_DIR = f"{BASE_DIR}/assets"
    CHIEF_NAMES_PATH = f"{ASSETS_DIR}/chief-names.json"
    PROJECT_NAME = "crypto-eval"


settings = Settings()

logging_settings = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(filename)s:%(lineno)d %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "standard",
            "filename": f"{settings.LOGS_DIR}/app.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "encoding": "utf8",
        },
    },
    "loggers": {
        settings.PROJECT_NAME: {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": True,
        },
        "uvicorn": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
        "uvicorn.error": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
        "uvicorn.access": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
