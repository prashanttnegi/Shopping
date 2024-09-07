from flask import request,render_template,send_file
from flask import jsonify, current_app as app
from flask_security import auth_required, roles_required
from PIL import Image as PILImage
from io import BytesIO
from application.models import *
from werkzeug.security import generate_password_hash, check_password_hash
import matplotlib.pyplot as plt
from .sec import datastore
from celery.result import AsyncResult
from .tasks import create_csv
from .instances import cache

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register_user():
    data=request.get_json()
    email=data['email']
    password=data['password']
    role=data['role']
    if not email:
        return jsonify({"error":"Email is required"}),400
    
    if datastore.find_user(email=email):
        return jsonify({"error":"Email already registered. Try logging in or registering using different email_id."}),402

    if role=='Store_Manager':
        datastore.create_user(email=email,password=generate_password_hash(password),active=False,roles=[role])
    else:
        datastore.create_user(email=email,password=generate_password_hash(password),roles=[role])
        
    db.session.commit()
    return jsonify({'message':'User registered successfully'}), 201
    

@app.route('/user_login', methods=['POST'])
def user_login():
    data=request.get_json()
    email=data['email']
    password=data['password']
    if not email:
        return jsonify({"error":"Email is required"}),400

    user=datastore.find_user(email=email)
    
    if not user:
        return jsonify({"error":"User not found"}),404
    
    if user.active==False:
        return jsonify({"error":"User not activated. Please activate your account"}),400
    
    if check_password_hash(user.password,password):
        return jsonify({"id":user.id,"email":user.email,"roles":user.roles[0].name,"token":user.get_auth_token()}),200
    
    else:
        return jsonify({"error":"Wrong password"}),400
    
@app.route('/unit')
@cache.cached(timeout=120)
def units():
    units=Units.query.all()
    units=[unit.name for unit in units]
    return jsonify(units)
    
@app.route('/image/<int:category_id>')
@cache.cached(timeout=60)
def display_image_category(category_id):
    category = Category.query.get(category_id)
    if category and category.image:
        return send_file(BytesIO(category.image), mimetype='image/jpeg')
    return 'Image not found'

@app.route('/product_image/<int:product_id>')
@cache.cached(timeout=60)
def display_image_product(product_id):
    product = Products.query.get(product_id)
    if product and product.image:
        return send_file(BytesIO(product.image), mimetype='image/jpeg')
    return 'Image not found'

@app.route('/download_csv')
@auth_required('token')
@roles_required('Store_Manager')
def download_csv():
    task=create_csv.delay()
    return jsonify({"task_id":task.id})

@app.route('/get_csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename=res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message":"Task Pending"}), 404
    
@app.route('/summary',methods=['GET','POST'])
def summary():
    categories=Category.query.all()
    names=[]
    quantities=[]
    for category in categories:
        if category.name not in names:
            names.append(category.name)
        else:
            pass
        quantities.append(len(category.products))

    orders=Orders.query.all()
    
    products={}
    
    for item in orders:
        if item.product_name  not in products.keys():
            quantity=int((item.quantity[0]) + item.quantity[1] if item.quantity[1].isdigit() else item.quantity[0])
            products[item.product_name]=quantity
        else:
            quantity=int((item.quantity[0]) + item.quantity[1] if item.quantity[1].isdigit() else item.quantity[0])
            products[item.product_name]+=quantity
            
    products=dict(sorted(products.items(), key=lambda x: x[1], reverse=True))
    
    plt.figure(figsize=(7, 5))
    plt.bar(names,quantities)
    plt.xlabel('Categories',fontsize=12)
    plt.ylabel('No. of Products',fontsize=12)
    plt.title('Category-wise products', fontsize=16)
    cat_wise_prod = "static/graph.png"
    plt.savefig(cat_wise_prod)

    plt.figure(figsize=(7, 5))
    plt.bar(list(products.keys())[:5],list(products.values())[:5])
    plt.xlabel('Products',fontsize=12)
    plt.ylabel('Sales Unit',fontsize=12)
    plt.title('Top-5 selling Products',fontsize=16)
    cat_wise_prod_2 = "static/graph_2.png"
    plt.savefig(cat_wise_prod_2)
    
    return jsonify({'first':cat_wise_prod,'second':cat_wise_prod_2})
    