import placedOrder from "./placedOrder.js";

export default{
    data(){
        return{
            cart:[],
            total:0,
            outOfStock:[]
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">

                </div>
                <div class="col-8">
                    <div class="card">
                        <div class="card-body" >
                            <ul class="list-group" v-if="cart.length>0">
                                <li class="list-group-item" v-for="item in cart">
                                    <span style="float:left">{{ item.product.category.name }} - {{ item.product.product_name }}</span>
                                    <span style="float:middle">{{ item.quantity }} {{item.product.unit.split('/')[1]}}- {{ item.product.rate }}{{ item.product.unit }}</span>
                                    <button class="btn btn-primary" @click='removeFromCart(item.cart_id)' role="button" style="float: right; width: 100px; height: 35px;">Remove</button>
                                </li>                
                            </ul>
                            <br>
                            <div v-if="outOfStock.length > 0">
                                <h5 style="margin-top:10px; margin-bottom:10px">
                                    Out of Stock Products
                                </h5>
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="item in outOfStock">
                                        <span style="float:left" class="opacity-75">{{ item.product.category.name }} - {{ item.product.product_name }}</span>
                                        <span style="float:middle" class="opacity-75"><strong style="color:red">Out of Stock</strong></span>
                                        <a class="btn btn-primary" href="/delete_item/{{user.id}}/{{item.cart_id}}" role="button" style="float: right; width: 100px; height: 35px;">Remove</a>
                                    </li>
                                </ul>
                            </div>
                            <br>
                            <h4 v-if="cart.length>0">
                                <span  style="float:left; margin-top: 20px">Grand Total: {{total}}</span>
                                <span style="float:right; margin-top: 15px">
                                    <button class="btn btn-info" @click='placeOrder' role="button" style="float: right; width: 100px; height: 40px;">Buy all</button>
                                </span>
                            </h4>
                            <div v-else>
                                <h2>Your Cart is empty! Please go Shopping.</h2>
                                <router-link to="/" class="btn btn-success" style="margin-top: 30px">Shopping</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">

                </div>
                <placedOrder ref="child" @callFetch="fetchCart"></placedOrder>
            </div>
        </div>
    `,
    async mounted(){
        this.fetchCart()
    },
    components:{
        placedOrder,
    },
    methods:{
        showPopup(data) {
            this.$refs.child.showPopup(data);
        },
        closePopupProduct() {
            this.$refs.child.closePopup();
            this.fetchCart()
        },
        async fetchCart(){
            try{
                const res= await fetch('/api/cart',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':this.$store.state.user.id
                    }
                })
                const data= await res.json()
                this.cart=data
                this.cart = this.cart.filter(item => {
                    if (item.quantity > item.product.quantity) {
                        this.outOfStock.push(item);
                        return false;
                    } else {
                        this.total += item.total;
                        return true;
                    }
                });
            }catch(error){
                console.log('Error:',error)
            }
        },
        async removeFromCart(id){
            try{
                const res= await fetch('/api/cart',{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                })
                
                const data= await res.json()
                if(res.ok){
                    alert('Product removed from cart!')
                    this.total=0
                    this.fetchCart()
                }
            }catch(error){
                console.log('Error:',error)
            }
        },
        async placeOrder(){
            try{
                const res= await fetch('/api/orders',{
                    method:'POST',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':this.$store.state.user.id
                    }
                })
                const data= await res.json()
                if(res.ok){
                    alert('Order Placed!')
                    this.total=0
                    this.showPopup(data)
                    this.fetchCart()
                }
            }catch(error){
                console.log('Error:',error)
            }
        }
    }
}