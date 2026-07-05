import sentry_sdk
import os
from dotenv import load_dotenv
load_dotenv()

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    send_default_pii=True,
)