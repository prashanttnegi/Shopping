# from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from .database import db
from datetime import datetime

# db=SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
            
class Products(db.Model):
    __tablename__="products"
    id=db.Column(db.Integer,primary_key=True, autoincrement=True)
    category_id=db.Column(db.Integer,db.ForeignKey('categories.id'),nullable=False)
    product_name=db.Column(db.String, nullable=False, unique=True)
    unit=db.Column(db.String,nullable=False)
    rate=db.Column(db.Float, nullable=False)
    quantity=db.Column(db.Float, nullable=False)
    image=db.Column(db.LargeBinary)    
    category=db.relationship('Category', backref='products', lazy=False)
    
class Category(db.Model):
    __tablename__="categories"
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    name=db.Column(db.String, nullable=False, unique=True)
    description=db.Column(db.String)
    image=db.Column(db.LargeBinary)
    active=db.Column(db.Boolean)
    requests=db.relationship('ManagerRequests', lazy=False)
    
class Units(db.Model):
    __tablename__="units"
    id=db.Column(db.Integer,primary_key=True, autoincrement=True)
    name=db.Column(db.String, unique=True, nullable=False)

class Cart(db.Model):
    __tablename__="cart"
    cart_id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    product_id=db.Column(db.Integer,db.ForeignKey('products.id'),nullable=False)
    quantity=db.Column(db.Float,nullable=False)
    total=db.Column(db.Float,nullable=False)
    user=db.relationship('User', backref='cart', lazy=True)
    product=db.relationship('Products', backref='cart', lazy=False)
    
class Orders(db.Model):
    __tablename__="orders"
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    order_id=db.Column(db.Integer, nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    category_name=db.Column(db.String,nullable=False)
    product_name=db.Column(db.String, nullable=False)
    quantity=db.Column(db.String,nullable=False)
    rate=db.Column(db.String, nullable=False)
    total=db.Column(db.Float,nullable=False)
    date=db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class ManagerRequests(db.Model):
    __tablename__="manager_requests"
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    category_id=db.Column(db.Integer,db.ForeignKey('categories.id'))
    method=db.Column(db.String, nullable=False)
    body=db.Column(db.Text)
    image=db.Column(db.LargeBinary)
    status=db.Column(db.Boolean, default=False)