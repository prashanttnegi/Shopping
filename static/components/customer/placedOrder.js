export default{
    data(){
        return{
            order:[],
            isPopupVisible:false,
            error:'',
            total:0
        }
    },
    template:`
        <div v-if="isPopupVisible" class="popup">
            <div class="popup-content">
                <button @click="closePopup" class="close-button">&times;</button>
                <div class="card">
                    <div class="card-body">
                        <div class="card" v-if="error">
                            <div class="card-body">
                                <h5 style="color:red">{{error}}</h5>
                            </div>
                        </div>
                        <h3 style="margin-top: 30px" class="card-title">Order Placed</h3>
                        <br>
                        <ol class="list-group list-group-numbered">
                            <li class="list-group-item d-flex justify-content-between align-items-start" v-for="item in order">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">{{ item.category_name }} - {{ item.product_name }}</div>
                                        {{ item.quantity }} - {{ item.rate }}
                                        <div class="fw-bold">Item Total: ₹{{ item.total }}</div>
                                </div>
                            </li> 
                        </ol>
                        <h4>
                            <div style="text-align:left; margin-top: 20px">Grand Total: ₹{{total}}</div>
                            <router-link to="/" class="btn btn-success" style="margin-top: 30px">Shopping</router-link>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods:{
        showPopup(data) {
            this.fetchOrder(data['order_id'])
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
        },
        async fetchOrder(id){
            try{
                const res=await fetch('/api/orders',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                });
                const data=await res.json();
                if (res.ok){
                    this.order= data.orders
                    for (let item of this.order){
                        this.total+=item.total
                    } 
                    this.$emit('callFetch')
                }
            }catch(error){
                console.log(error)
            }
        }
    }
}