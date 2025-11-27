from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os
from sqlalchemy.types import TypeDecorator, String

load_dotenv()

KEY = os.getenv("KEY")
cipher = Fernet(KEY)


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
