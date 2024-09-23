from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from backend.server import database
from .database import get_productivity_summary, get_db

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Productivity Dashboard API"}


@app.get("/activity_logs")
async def get_activity_logs(db: Session = Depends(get_db)):
    logs = database.get_activity_logs(db)
    return logs


@app.get("/activity_summary/")
async def get_activity_summary(days: int = 7, db: Session = Depends(get_db)):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    summary = database.get_activity_summary(db, start_date, end_date)
    return summary


@app.get("/keystrokes_per_minute/")
async def get_keystrokes_per_minute(db: Session = Depends(get_db)):
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=1)
    data = database.get_keystrokes_per_minute(db, start_time, end_time)
    return data


@app.get("/daily_keystrokes/")
async def get_daily_keystrokes(days: int = 7, db: Session = Depends(get_db)):
    data = database.get_daily_keystrokes(db, days)
    return data


@app.get("/daily_app_usage")
async def get_daily_app_usage(db: Session = Depends(get_db)):
    data = database.get_daily_app_usage(db)
    return data


@app.get("/productivity_trend/")
async def get_productivity_trend(days: int = 7, db: Session = Depends(get_db)):
    data = database.get_productivity_trend(db, days)
    return data


@app.get("/daily_key_presses")
async def get_daily_key_presses(db: Session = Depends(get_db)):
    data = database.get_daily_key_presses(db)
    return data


@app.get("/api/productivity-summary")
async def get_productivity_summary_api(
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
):
    start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
    end_datetime = datetime.strptime(end_date, "%Y-%m-%d")

    keypress_data, category_data = get_productivity_summary(
        db, start_datetime, end_datetime
    )

    return {"keypress_data": keypress_data, "category_data": category_data}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
