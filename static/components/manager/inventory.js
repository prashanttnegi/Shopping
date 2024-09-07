import editProduct from "./editProduct.js";
export default{
    data(){
        return{
            products:[],
            role:localStorage.getItem('role'),
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">
                    
                </div>
                <div class="col-12">  
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">S.No.</th>
                                <th scope="col">Category</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product,index) in products">
                                    <th scope="row">{{index+1}}</th>
                                    <td>{{product.category.name}}</td>
                                    <td>{{product.product_name}}</td>
                                    <td>{{product.rate}}{{product.unit}}</td>
                                    <td><div v-if="product.quantity==0" style="color:red;font-weight: bold;">Out of Stock</div><div v-else>{{product.quantity}}</div></td>
                                    <td>
                                        <div class="dropdown">
                                            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                Edit/Delete
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <li><button class="dropdown-item" @click="showPopupEditProduct(product.id)">Edit</button></li>
                                                <li><button class="dropdown-item" id="deleteButton" data-bs-toggle="modal" :data-bs-target="'#confirmationModal' + product.id">Delete</button></li>
                                            </ul>
                                            <div class="modal fade" :id="'confirmationModal' + product.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index: 10000;">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body">
                                                            Are you sure you want to delete this item?
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="button" class="btn btn-danger" @click="deleteProduct(product.id)" data-bs-dismiss="modal">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <editProduct ref="child" @callFetch3="fetchProducts"></editProduct>
                </div>
                <div class="col">
                            
                </div>
            </div>
        </div>
    `,
    components:{
        editProduct
    },
    async mounted(){
        this.fetchProducts()
    },
    methods:{
        showPopupEditProduct(productId) {
            this.$refs.child.showPopup(productId);
        },
        closePopupEditProduct() {
            this.$refs.child.closePopup();
            this.fetchProducts()
        },
        async fetchProducts(){
            try{
                const res=await fetch('/api/product',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.products=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        async deleteProduct(id){
            try{
                const res=await fetch('/api/product',{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                })
                const data=await res.json()
                this.fetchCategories()
                if (res.ok){
                    alert("Product deleted successfully")
                }else{
                    alert("Some error happened")
                    console.log(data)
                }
            } catch(error){
                console.log('Error:',error)
            }
        }
    }
}