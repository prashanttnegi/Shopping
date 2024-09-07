from main import app
from application.models import *
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    app.security.datastore.find_or_create_role(
        name="Admin", description="User is an Admin"
    )
    app.security.datastore.find_or_create_role(
        name="Store_Manager", description="User is an Store Manager"
    )
    app.security.datastore.find_or_create_role(
        name="Customer", description="User is an Customer"
    )
    db.session.commit()
    if not app.security.datastore.find_user(email="admin@gmail.com"):
        app.security.datastore.create_user(email="admin@gmail.com",password=generate_password_hash  ("possible"), roles=["Admin"])
    db.session.commit()