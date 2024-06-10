from celery import shared_task
from .models import Album, Song, User, Playlist,db
from .mail_service import send_email
from datetime import  date
from flask import render_template
from datetime import datetime




@shared_task(ignored_result=True)
def daily_reminder(subject):
    users= User.query.filter(User.roles.any(name='user')).all()

    today = date.today()
    for user in users:       
        if user.last_login and user.last_login.date() != today:
            send_email(user.email, subject, "hello user, seems like you haven't visited the app today. Do check it out now !" )
    return "OK"



@shared_task(ignore_result=True)
def daily_creator_report(subject):
    current_month = datetime.now().month  # - 1 if datetime.now().month > 1 else 12
    current_year = datetime.now().year    # if current_month != 12 else datetime.now().year - 1
    
    users = User.query.filter(User.roles.any(name = 'creator')).all()
    
    for user in users:                
                songs = Song.query.filter(
                    Song.album.has(Album.creator == user),
                    db.extract('month', Song.date_created) == current_month,
                    db.extract('year', Song.date_created) == current_year).all()
        
                albums = Album.query.filter(
                Album.creator == user,
                db.extract('month', Album.date_created) == current_month,
                db.extract('year', Album.date_created) == current_year ).all()

            # Render the HTML template with the filtered songs and albums data
                send_email(user.email, subject,
                            render_template("report.html", user=user, songs=songs, albums=albums)
                        )

    return "Monthly creator reports sent"