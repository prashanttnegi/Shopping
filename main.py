from flask import Flask
from application.worker import celery_init_app
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder, monthly_activity
from application.instances import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.controllers

    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=20, minute=30),
        daily_reminder.s(),
    )
    sender.add_periodic_task(
        crontab(0,0,day_of_month=30),
        monthly_activity.s(),
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
    