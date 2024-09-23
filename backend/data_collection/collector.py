import time
from pynput import keyboard
from AppKit import NSWorkspace
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from cryptography.fernet import Fernet
import keyring
import os
from datetime import datetime

# Database setup
Base = declarative_base()
engine = create_engine("sqlite:///productivity_data.db")
Session = sessionmaker(bind=engine)

# Encryption setup
def get_or_create_key():
    service_name = "ProductivityDashboard"
    account_name = "EncryptionKey"

    stored_key = keyring.get_password(service_name, account_name)
    if stored_key is None:
        new_key = Fernet.generate_key()
        keyring.set_password(service_name, account_name, new_key.decode())
        return new_key
    return stored_key.encode()

key = get_or_create_key()
cipher_suite = Fernet(key)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime)
    window_title = Column(String)
    key_pressed = Column(String)

Base.metadata.create_all(engine)

def encrypt_data(data):
    return cipher_suite.encrypt(data.encode()).decode()

def get_active_window_title():
    workspace = NSWorkspace.sharedWorkspace()
    active_app = workspace.activeApplication()
    return active_app['NSApplicationName']

def on_press(key):
    try:
        key_char = key.char
    except AttributeError:
        key_char = str(key)

    window_title = get_active_window_title()

    session = Session()
    log = ActivityLog(
        timestamp=datetime.now(),
        window_title=encrypt_data(window_title),
        key_pressed=encrypt_data(key_char),
    )
    session.add(log)
    session.commit()
    session.close()

def start_logging():
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

if __name__ == "__main__":
    start_logging()
