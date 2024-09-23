from sqlalchemy import create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.data_collection.collector import ActivityLog
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import keyring

SQLALCHEMY_DATABASE_URL = "sqlite:///./productivity_data.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Add this function to the database.py file
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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


def decrypt_data(encrypted_data):
    return cipher_suite.decrypt(encrypted_data.encode()).decode()


def get_activity_logs(db, skip: int = 0, limit: int = 1000):
    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    decrypted_logs = []
    for log in logs:
        decrypted_logs.append(
            {
                "id": log.id,
                "timestamp": log.timestamp,
                "window_title": decrypt_data(log.window_title),
                "key_pressed": decrypt_data(log.key_pressed),
            }
        )
    return decrypted_logs


def get_activity_summary(db, start_date, end_date):
    return (
        db.query(
            func.date(ActivityLog.timestamp).label("date"),
            func.count(ActivityLog.id).label("activity_count"),
        )
        .filter(ActivityLog.timestamp.between(start_date, end_date))
        .group_by(func.date(ActivityLog.timestamp))
        .all()
    )


def get_keystrokes_per_minute(db, start_time, end_time):
    result = (
        db.query(
            func.strftime("%Y-%m-%d %H:%M", ActivityLog.timestamp).label("minute"),
            func.count(ActivityLog.id).label("keystroke_count"),
        )
        .filter(ActivityLog.timestamp.between(start_time, end_time))
        .group_by("minute")
        .order_by("minute")
        .all()
    )

    # Fill in missing minutes with zero keystrokes
    all_minutes = {}
    current = start_time
    while current <= end_time:
        all_minutes[current.strftime("%Y-%m-%d %H:%M")] = 0
        current += timedelta(minutes=1)

    for row in result:
        all_minutes[row.minute] = row.keystroke_count

    return [{"minute": k, "keystroke_count": v} for k, v in all_minutes.items()]


def get_daily_keystrokes(db, days):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    result = (
        db.query(
            func.date(ActivityLog.timestamp).label("date"),
            ActivityLog.window_title,
            func.count(ActivityLog.id).label("keystroke_count"),
        )
        .filter(ActivityLog.timestamp.between(start_date, end_date))
        .group_by(func.date(ActivityLog.timestamp), ActivityLog.window_title)
        .order_by(func.date(ActivityLog.timestamp))
        .all()
    )

    daily_data = {}
    for row in result:
        date = str(row.date)
        if date not in daily_data:
            daily_data[date] = {"total": 0, "windows": {}}
        daily_data[date]["total"] += row.keystroke_count
        daily_data[date]["windows"][row.window_title] = row.keystroke_count

    return [{"date": date, **data} for date, data in daily_data.items()]


def get_daily_app_usage(db):
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)

    # Query all activity logs for the day without grouping
    result = (
        db.query(ActivityLog)
        .filter(ActivityLog.timestamp >= today, ActivityLog.timestamp < tomorrow)
        .all()
    )

    # Decrypt and aggregate data
    app_usage = {}
    for log in result:
        window_title = decrypt_data(log.window_title)
        app_usage[window_title] = app_usage.get(window_title, 0) + 1

    # Sort the results
    sorted_usage = sorted(app_usage.items(), key=lambda x: x[1], reverse=True)

    return [
        {"window_title": title, "keystroke_count": count}
        for title, count in sorted_usage
    ]


def get_productivity_trend(db, days):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    result = db.query(
        func.date(ActivityLog.timestamp).label('date'),
        ActivityLog.window_title,
        func.count(ActivityLog.id).label('keystroke_count')
    ).filter(
        ActivityLog.timestamp >= start_date,
        ActivityLog.timestamp <= end_date
    ).group_by(
        'date',
        ActivityLog.window_title
    ).order_by(
        'date'
    ).all()
    
    trend_data = {}
    for row in result:
        date = row.date.isoformat()
        window_title = decrypt_data(row.window_title)
        if date not in trend_data:
            trend_data[date] = {}
        trend_data[date][window_title] = row.keystroke_count
    
    return [{"date": date, **apps} for date, apps in trend_data.items()]


def get_daily_key_presses(db):
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)

    result = db.query(
        func.strftime('%Y-%m-%d %H:00:00', ActivityLog.timestamp).label('hour'),
        func.count(ActivityLog.id).label('keystroke_count')
    ).filter(
        ActivityLog.timestamp >= today,
        ActivityLog.timestamp < tomorrow
    ).group_by(
        'hour'
    ).order_by(
        'hour'
    ).all()

    # Fill in missing hours with zero keystrokes
    all_hours = {}
    current_hour = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(tomorrow, datetime.min.time())
    while current_hour < end_of_day:
        all_hours[current_hour.strftime('%Y-%m-%d %H:00:00')] = 0
        current_hour += timedelta(hours=1)

    for row in result:
        all_hours[row.hour] = row.keystroke_count

    return [{"hour": k, "keystroke_count": v} for k, v in all_hours.items()]


def get_productivity_summary(db, start_date, end_date):
    keypress_data = (
        db.query(
            func.date_trunc('hour', ActivityLog.timestamp).label('hour'),
            func.count(ActivityLog.id).label('total_count')
        )
        .filter(ActivityLog.timestamp.between(start_date, end_date))
        .group_by('hour')
        .order_by('hour')
        .all()
    )
    
    category_data = (
        db.query(
            ActivityLog.window_title,
            func.sum(func.julianday(func.lead(ActivityLog.timestamp).over(order_by=ActivityLog.timestamp) - ActivityLog.timestamp) * 24 * 60 * 60).label('duration')
        )
        .filter(ActivityLog.timestamp.between(start_date, end_date))
        .group_by(ActivityLog.window_title)
        .all()
    )
    
    keypress_result = [{"timestamp": row.hour.isoformat(), "count": row.total_count} for row in keypress_data]
    category_result = {decrypt_data(row.window_title): row.duration for row in category_data}
    
    return keypress_result, category_result
