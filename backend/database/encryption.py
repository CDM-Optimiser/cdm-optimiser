from cryptography.fernet import Fernet
import os
import logging
from pathlib import Path
from dotenv import load_dotenv, find_dotenv, set_key
from sqlalchemy.types import TypeDecorator, String

load_dotenv()

logger = logging.getLogger(__name__)

KEY = os.getenv("KEY")

ALLOW_KEY_GEN = os.getenv("ALLOW_KEY_GENERATION", "1").lower() in ("1", "true", "yes")

if not KEY and ALLOW_KEY_GEN:
    try:
        new_key = Fernet.generate_key().decode()
        dotenv_path = find_dotenv(usecwd=True)
        if not dotenv_path:
            dotenv_path = str(Path.cwd() / ".env")
            Path(dotenv_path).touch(exist_ok=True)

        set_key(dotenv_path, "KEY", new_key)
        os.environ["KEY"] = new_key
        KEY = new_key
        logger.info("Generated and saved new Fernet KEY to %s", dotenv_path)
    except Exception:
        logger.exception(
            "Failed to auto-generate KEY - please create a .env with KEY or set env var"
        )

if not KEY:
    raise RuntimeError(
        "Missing KEY environment variable. Please set KEY in your system env or .env file. "
        'You can generate a Fernet key with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"'
    )

if isinstance(KEY, str):
    KEY_BYTES = KEY.encode()
else:
    KEY_BYTES = KEY

try:
    cipher = Fernet(KEY_BYTES)
except Exception as e:
    raise RuntimeError(
        "Invalid KEY for Fernet. Key must be a URL-safe base64-encoded 32-byte key"
    ) from e


class EncryptedString(TypeDecorator):
    impl = String

    def process_bind_param(self, value, dialect):
        """Encrypt before saving to DB"""
        if value is None:
            return None

        if isinstance(value, bool):
            value = str(value)
        elif isinstance(value, int):
            value = str(value)

        if not isinstance(value, (str, bytes)):
            value = str(value)

        if isinstance(value, str):
            value_bytes = value.encode()
        else:
            value_bytes = value

        encrypted = cipher.encrypt(value_bytes)
        return encrypted.decode()

    def process_result_value(self, value, dialect):
        """Decrypt after reading from DB"""
        if value is None:
            return None

        try:
            encrypted_bytes = value.encode() if isinstance(value, str) else value
            decrypted = cipher.decrypt(encrypted_bytes)

            decrypted_value = decrypted.decode()
            if decrypted_value.isdigit():
                return int(decrypted_value)
            elif decrypted_value.lower() in ["true", "false"]:
                return decrypted_value.lower() == "true"
            return decrypted_value
        except Exception:
            return value
