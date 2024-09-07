from celery import shared_task
from .models import Category, User, Orders, Products
import flask_excel as excel
from .mail_service import send_email
from datetime import datetime, timedelta
from jinja2 import Template

@shared_task(ignore_result=False)
def create_csv():
    prod = Products.query.with_entities(Products.product_name, Products.quantity, Products.rate).all()
    sale_quantity=[]
    for pro in prod:
        sales=Orders.query.with_entities(Orders.quantity).filter(Orders.product_name==pro.product_name).all()
        total_sales = sum(int(sale.quantity.split('.')[0]) for sale in sales)
        sale_quantity.append(total_sales)
        
    prod_with_sales = [(pro[0], pro[1], pro[2], sale_qty) for pro, sale_qty in zip(prod, sale_quantity)]
    data = [
        ("Product Name", "Stock", "Rate", "Sales"),
        *prod_with_sales
    ]
    csv_output = excel.make_response_from_array(data,"csv")
    filename="product_summary.csv"
    
    with open(filename,'wb') as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=False)
def daily_reminder():
    users=User.query.filter(User.roles.any(name='Customer')).all()
    current_date=datetime.now()
    current_date=current_date.strftime("%Y/%m/%d")
    
    for user in users:
        today_orders=Orders.query.filter_by(user_id=user.id).all()
        for order in today_orders:
            order_date=order.date
            if order_date.strftime("%Y/%m/%d")==current_date:
                users.remove(user)
                break
    for user in users:
        send_email(user.email,"Please Visit","<html>Hello, this is a daily reminder just to remind you to visit our application 127.0.0.1:5000<html>")
    return "Email sent."

@shared_task(ignore_result=False)
def monthly_activity():
    current_date = datetime.now()
    # Calculate the first day of the last month
    first_day_of_last_month = datetime(current_date.year, current_date.month - 1, 1) if current_date.month > 1 else datetime(current_date.year - 1, 12, 1)


    # Calculate the last day of the last month
    last_day_of_last_month = datetime(current_date.year, current_date.month, 1) - timedelta(days=1)
    
    subject="Monthly Order Summary"
    users=User.query.filter(User.roles.any(name='Customer')).all()
    for user in users:
        monthly_orders=Orders.query.filter(Orders.user_id==user.id,Orders.date.between(first_day_of_last_month,last_day_of_last_month)).all()
        all_orders=[]
        count=0
        total=[]
        if monthly_orders:
            all_orders.append([monthly_orders[0]])
            total.append(monthly_orders[0].total)
            for i in range(1,len(monthly_orders)):
                if monthly_orders[i].order_id == all_orders[count][0].order_id:
                    all_orders[count].append(monthly_orders[i])
                    total[count]+=monthly_orders[i].total
                    
                else:
                    count+=1
                    all_orders.append([])
                    total.append(0)
                    all_orders[count].append(monthly_orders[i])
                    total[count]+=monthly_orders[i].total
        with open('templates/monthly_report.html','r') as f:
            template=Template(f.read())
        send_email(user.email,subject,template.render(orders=all_orders,total=total,email=user.email))

    return "Monthly report sent." 