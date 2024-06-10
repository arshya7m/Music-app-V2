from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resourses import api
from application.sec import datastore
from application.worker import celery_init_app
from celery.schedules import crontab
from application.tasks import daily_reminder,daily_creator_report
from application.instances import cache



def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views


    return app


app = create_app()
celery_app = celery_init_app(app)



@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=23, minute=12),    # day_of_month=16
        daily_reminder.s('Daily Reminder Mail'),
    )

@celery_app.on_after_configure.connect
def send_report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=23, minute=12),    # day_of_month=1
        daily_creator_report.s('Monthly Activity Report'),
    )

if __name__ == '__main__':
    app.run(debug=True)
