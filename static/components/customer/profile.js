export default{
    data(){
        return{
            total:[],
            orders:[],
            role:localStorage.getItem('role')
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">

                </div>
                <div class="col-10">
                    <div class="card">
                    <div class="card-body">
                        <div class="details-box">
                            <h2>Your Details</h2>
                            <p><strong>Email:</strong> {{user.email}} </p>                  
                        </div>
                        <p>
                            <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                Orders
                            </a>
                        </p>
                        <div class="collapse" id="collapseExample">
                            <div class="card card-body">
                                <div class="accordion accordion-flush" id="accordionFlushExample" v-if="orders.length>0">
                                    <div class="accordion-item" v-for="(order, index) in orders">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapse' + index" aria-expanded="false" aria-controls="flush-collapseOne">
                                                <div class="me-auto">
                                                <strong>Order No. {{index+1}}</strong>
                                                </div>
                                                <div class="ms-2">{{formatDate(order[0].date)}}</div>
                                                <div class="ms-md-auto"><span>&#8377;</span>{{total[index]}}</div>
                                            </button>
                                        </h2>
                                        <div :id="'flush-collapse' + index" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    <li class="list-group-item d-flex flex-column flex-md-row justify-content-md-between align-items-start" v-for="item in order">
                                                        <div class="me-auto">
                                                            <div class="fw-bold">{{ item.category_name }} - {{ item.product_name }}</div>
                                                            <div>{{ item.quantity }}-{{ item.rate }}</div>
                                                        </div>
                                                        <div class="ms-2">Value : <span>&#8377;</span>{{item.total}}</div> 
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <div v-else>
                                    No orders yet
                                </div>                           
                            </div>
                        </div>
                        <hr>
                        <div>
                            <button type="button" v-if="role!=='Admin'" class="btn btn-danger btn-lg" id="deleteButton" style="margin-top:10px" data-bs-toggle="modal" :data-bs-target="'#confirmationModal' + user.id">Delete</button>
                        </div>
                        <div class="modal fade" :id="'confirmationModal' + user.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index: 10000;">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        Are you sure you want to delete this user?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-danger" @click="deleteUser(user.id)">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col">

                </div>
            </div>
        </div>
    `,
    computed:{
        user(){
            return this.$store.state.user;
        }
    },
    async mounted(){
        this.fetchOrder();
    },
    methods:{
        async fetchOrder(){
            try{
                const res=await fetch('/api/orders',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'user_id':this.$store.state.user.id,
                    }
                });
                const data=await res.json();
                if (res.ok){
                    this.orders= data.orders
                    this.total= data.total
                }
            }catch(error){
                console.log(error)
            }
        },
        formatDate(date) {
            const formattedDate = new Date(date);
            return formattedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' });
        },
        async deleteUser(id){
            try{
                const res=await fetch('/api/users',{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    },
                })    
                const data=await res.json();
                if(res.ok){
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    this.$router.push('/');
                }
            }catch(error){
                console.log(error)
            }
        }
    }
}