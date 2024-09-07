from flask_restful import Resource, Api, marshal_with, fields, reqparse, marshal
from application.models import *
from flask_security import auth_required, roles_required
from flask import request
from PIL import Image as PILImage
import io
from io import BytesIO
import json
from .instances import cache


api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help="name should be a string")
parser.add_argument('description', type=str, help="description should be a string")

category_fields={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'products': fields.List(fields.Nested({
        'id': fields.Integer,
        'category_id': fields.Integer,
        'product_name': fields.String,
        'rate': fields.String,
        'unit': fields.String,
        'quantity': fields.String,
        'price': fields.Integer,
    }))
}

class all_catgories(Resource):
    @marshal_with(category_fields)
    def get(self):
        id=request.headers.get('id')
        if id:
            category=Category.query.get(int(id))
            return category, 200
        all_category=Category.query.all()
        return all_category, 200

    @auth_required('token')
    @roles_required('Admin')
    def post(self):
        name=request.form.get('name')
        description=request.form.get('description')
        image_file = request.files['image']

        # Read the image file and convert it to binary data
        pil_image = PILImage.open(image_file)
        rgb_img = pil_image.convert('RGB')
        image_data = io.BytesIO()
        rgb_img.save(image_data, format='JPEG')
        image_data = image_data.getvalue()

        c1=Category(name=name,description=description,image=image_data)
        db.session.add(c1)
        db.session.commit()
        return {'message':'Created Succesfully'},200
    
    @auth_required('token')
    @roles_required('Admin')
    def put(self):
        c_id=request.form.get('id')
        cat=Category.query.get(int(c_id))
        name=request.form.get('name')
        description=request.form.get('description')
        if name:
            cat.name=name
        if description:
            cat.description=description
        
        checkbox_value = request.form.get("readCheckbox")
        if checkbox_value == "on":    
            image_file = request.files['image']
            pil_image = PILImage.open(image_file)
            rgb_img = pil_image.convert('RGB')
            image_data = io.BytesIO()
            rgb_img.save(image_data, format='JPEG')
            image_data = image_data.getvalue()
            cat.image = image_data

        db.session.commit()
        return {'message':'Updated Succesfully'},200
    
    @auth_required('token')
    @roles_required('Admin')
    def delete(self):  
        id=request.headers.get('id')
        cat=Category.query.get(int(id))
        products=cat.products
        for product in products:
            db.session.delete(product)
        reqs=cat.requests
        for req in reqs:
            db.session.delete(req)
        db.session.delete(cat)
        db.session.commit()
        return 204

api.add_resource(all_catgories, '/category')

product_fields={
    'id': fields.Integer,
    'category_id': fields.Integer,
    'product_name': fields.String,
    'unit': fields.String,
    'rate': fields.String,
    'quantity': fields.String,
    'category':fields.Nested(category_fields)
}

class all_products(Resource):
    @marshal_with(product_fields)
    @auth_required('token')
    def get(self):
        id=request.headers.get('id')
        if id:
            prod=Products.query.get(int(id))
        else:
            prod=Products.query.all()
        return prod, 200

    @auth_required('token')
    @roles_required('Admin' or 'Store_Manager')
    def post(self):
        category_id=request.form.get('category_id')
        name=request.form.get('name')
        unit=request.form.get('unit')
        rate=request.form.get('rate')
        quantity=request.form.get('quantity')
        image_file = request.files['image']

        # Read the image file and convert it to binary data
        pil_image = PILImage.open(image_file)
        rgb_img = pil_image.convert('RGB')
        image_data = io.BytesIO()
        rgb_img.save(image_data, format='JPEG')
        image_data = image_data.getvalue()

        p1=Products(category_id=category_id,product_name=name,unit=unit,rate=rate,quantity=quantity,image=image_data)
        db.session.add(p1)
        db.session.commit()
        return {'message':'Created Succesfully'},200
    
    @auth_required('token')
    @roles_required('Admin' or 'Store_Manager')
    def put(self):
        id=request.form.get('id')
        prod=Products.query.get(int(id))
        name=request.form.get('name')
        category=request.form.get('category_id')
        rate=request.form.get('rate')
        quantity=request.form.get('quantity')
        
        if name:
            prod.product_name=name
        if rate:
            prod.rate=rate
        if quantity:
            prod.quantity=quantity
        if category:
            prod.category_id=category
            
        checkbox_value = request.form.get("readCheckbox")
        if checkbox_value == "on":    
            image_file = request.files['image']
            pil_image = PILImage.open(image_file)
            rgb_img = pil_image.convert('RGB')
            image_data = io.BytesIO()
            rgb_img.save(image_data, format='JPEG')
            image_data = image_data.getvalue()
            prod.image=image_data
        
        db.session.commit()
        return {'message':'Updated Succesfully'},200
    
    @auth_required('token')
    @roles_required('Admin' or 'Store_Manager')
    def delete(self):  
        id=request.headers.get('id')
        prod=Products.query.get(int(id))
        items=prod.cart
        for item in items:
            db.session.delete(item)
        db.session.delete(prod)
        db.session.commit()
        return 204

api.add_resource(all_products, '/product')


user_fields={
    'id': fields.Integer,
    'email': fields.String,
    'active': fields.Boolean,
    'roles': fields.String,
}
class users(Resource):
    @auth_required('token')
    @roles_required('Admin')
    @marshal_with(user_fields)
    def get(self):
        all_users=User.query.all()
        users=[]
        for user in all_users:
            if user.roles[0].name=='Store_Manager' and user.active==False:
                users.append(user)
        return users, 200
    
    @auth_required('token')
    @roles_required('Admin')
    def patch(self):
        id=request.headers.get('id')
        user=User.query.get(int(id))
        if user:
            user.active=True
            db.session.commit()
            return {'message':'Updated Succesfully'},200
        else:
            return {'message':'User not found'},404
        
    @auth_required('token')
    @roles_required('Store_Manager' or 'Customer')
    def delete(self):
        id=request.headers.get('id')
        print(id)
        user=User.query.get(id)
        if user.cart:
            for products in user.cart:
                db.session.delete(products)
        db.session.delete(user)
        db.session.commit()
        return {'message':'User deleted successfully'},202
        
api.add_resource(users, '/users')


requests_fields={
    'id' : fields.Integer,
    'user_id' : fields.Integer,
    'category_id' : fields.Integer,
    'method' : fields.String,
    'body' : fields.List(fields.Nested({
        'name' : fields.String,
        'description' : fields.String 
    })),
    'image' : fields.String,
    'status' : fields.Boolean,
}

class managerRequests(Resource):
    @auth_required('token')
    @roles_required('Admin')
    @marshal_with(requests_fields)
    def get(self):
        requests = ManagerRequests.query.filter_by(status=False).all()
        return requests
    
    @auth_required('token')
    @roles_required('Store_Manager' or 'Admin')
    @marshal_with(requests_fields)
    def post(self):
        name=request.form.get('name')
        description=request.form.get('description')
        data=json.loads(request.form.get('json_data'))
        cat_id=data['category_id'] if data['category_id'] else None
        body={'name':None,'description':None}
        if name:
            body['name']=name
        if description:
            body['description']=description
        
        checkbox_value = request.form.get('readCheckbox')
        if checkbox_value == "on":
            image_file = request.files['image']
            pil_image = PILImage.open(image_file)
            rgb_img = pil_image.convert('RGB')
            image_data = io.BytesIO()
            rgb_img.save(image_data, format='JPEG')
            image_data = image_data.getvalue()
            
            req = ManagerRequests(user_id=data['user_id'], category_id=cat_id, method=data['method'], body=json.dumps(body), image=image_data)
        else:            
            req = ManagerRequests(user_id=data['user_id'], category_id=cat_id, method=data['method'], body=json.dumps(body))
        db.session.add(req)
        db.session.commit()
        return {"message":"Request generated successfully"},201
   
    @auth_required('token')
    @roles_required('Admin')
    def patch(self):
        id=request.headers.get('id')
        req=ManagerRequests.query.get(int(id))
        print(req.status)
        if req.method=='DELETE':
            cat=Category.query.get(req.category_id)
            all_requests=cat.requests
            for reques in all_requests:
                if reques.id==int(id):
                    products=cat.products
                    for product in products:
                        items=product.cart
                        for item in items:
                            db.session.delete(item)
                        db.session.delete(product)
                    db.session.delete(cat)
                    reques.status=True
                else:
                    db.session.delete(reques)
            
            db.session.commit()
            return {'message':'Deleted Succesfully'},200
        
        if req.method=='POST':
            try:
                content=json.loads(req.body)
                print(content)
                name=content['name']
                description=content['description']
                image_data = req.image

                c1=Category(name=name,description=description,image=image_data)
                db.session.add(c1)
                req.status=True
                db.session.commit()
                return {'message':'Created Succesfully'},200      
            except:
                return {'message':'Category already existed'},400
            
        if req.method=='PUT':
            try:
                content=json.loads(req.body)
                name=content['name']
                description=content['description']
                image_data = req.image
                cat=Category.query.get(req.category_id)
                req.status=True
                
                if name:
                    cat.name=name
                if description:
                    cat.description=description
                
                if image_data:
                    cat.image = image_data
                
                db.session.commit()
                return {'message':'Updated Succesfully'},200
            except:
                return {'message':'Category not found'},400
            
        else:
            return {'message':'Request not found'},404
           
    @auth_required('token')
    @roles_required('Admin')
    def delete(self):
        id=request.headers.get('id')
        req=ManagerRequests.query.get(int(id))
        db.session.delete(req)
        db.session.commit()
        return {'message':'Deleted Succesfully'},200
    
api.add_resource(managerRequests, '/manager_requests')

cart_fields={
    'cart_id' : fields.Integer,
    'user_id' : fields.Integer,
    'product_id' : fields.Integer,
    'quantity' : fields.Integer,
    'total' : fields.Integer,
    'product': fields.Nested(product_fields),
}

class user_cart(Resource):
    @auth_required('token')
    @marshal_with(cart_fields)
    def get(self):
        user=request.headers.get('id')
        cart=Cart.query.filter_by(user_id=user).all()        
        return cart, 200
    
    @auth_required('token')
    def post(self):
        user_id=request.form.get('user_id')
        product_id=request.form.get('product_id')
        quantity=request.form.get('quantity')
        total=request.form.get('total')
        c1=Cart(user_id=user_id,product_id=product_id,quantity=quantity,total=total)
        db.session.add(c1)
        db.session.commit()
        return {"message":"Added to cart successfully"},200
    
    @auth_required('token')
    def delete(self):
        id=request.headers.get('id')
        cart=Cart.query.get(int(id))
        db.session.delete(cart)
        db.session.commit()
        return {'message':'Deleted Succesfully'},200

api.add_resource(user_cart, '/cart')

order_fields={
    'order_id' : fields.Integer,
    'user_id' : fields.Integer,
    'category_name' : fields.String,
    'product_name' : fields.String,
    'quantity' : fields.String,
    'rate' : fields.String,
    'total' : fields.Integer,
    'date' : fields.DateTime,
}

class orders(Resource):
    @auth_required('token')
    def get(self):
        id=request.headers.get('id')
        user_id=request.headers.get('user_id')
        if id:
            order=Orders.query.filter_by(order_id=id).all()
            return {'orders':marshal(order,order_fields)},200
        else:
            orders=Orders.query.filter_by(user_id=user_id).all()
            all_orders=[]
            count=0
            total=[]
            if orders:
                all_orders.append([orders[0]])
                total.append(orders[0].total)
                for i in range(1,len(orders)):
                    if orders[i].order_id == all_orders[count][0].order_id:
                        all_orders[count].append(orders[i])
                        total[count]+=orders[i].total
                        
                    else:
                        count+=1
                        all_orders.append([])
                        total.append(0)
                        all_orders[count].append(orders[i])
                        total[count]+=orders[i].total
            return {'orders':marshal(all_orders,order_fields),'total':total},200
        
    @auth_required('token')
    def post(self):
        user=request.headers.get('id')
        cart=Cart.query.filter_by(user_id=user).all()
        new_cart=cart.copy()
        total=0
        order_id=Orders.query.all()
        if order_id:
            order_id=Orders.query.all()[-1].order_id+1
        else:
            order_id=1
        out_of_stock=[]
        for el in cart:
            if el.product.quantity<el.quantity:
                out_of_stock.append(el)
                new_cart.remove(el)
            else:
                pass

        for i in new_cart:
            o1=Orders(order_id=order_id,user_id=user,category_name=i.product.category.name,product_name=i.product.product_name,quantity=str(i.quantity)+i.product.unit.split('/')[-1],rate=str(i.product.rate)+i.product.unit,total=i.total)
            db.session.add(o1)
            i.product.quantity-=float(i.quantity)
            total+=i.total
            db.session.delete(i)
        db.session.commit()
        return {'message':'Order placed successfully','order_id':order_id,'total':total},200
        
api.add_resource(orders, '/orders')


class search(Resource):
    @auth_required('token')
    def post(self):
        searched = request.form.get('search')
        categories=Category.query.filter(Category.name.like(f'%{searched}%')).all()
        print(categories)
        products=Products.query.filter(Products.product_name.like(f'%{searched}%')).all()
        if categories:
            return {'item':'Category','result':marshal(categories[0],category_fields)},200
        if products:
            return {'item':'Product','result':marshal(products,product_fields)},200
        else:
            return {'error':"No results found"},308
        
api.add_resource(search, '/search')

