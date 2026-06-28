import os
from dotenv import load_dotenv
load_dotenv()

DRF_RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")