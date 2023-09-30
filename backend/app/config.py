import os

# TODO: handle fastapi settings with env
class Settings:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    ASSETS_DIR = f"{BASE_DIR}/assets"
    CHIEF_NAMES_PATH = f"{ASSETS_DIR}/chief-names.json"


settings = Settings()