import addProduct from "../admin/addProduct.js"
import addCategory from "../admin/addCategory.js"
import editProduct from "./editProduct.js"
import editCategory from "../admin/editCategory.js"

export default{
    data(){
        return{
            categories:[],
            products:[],
            content:{
                user_id:null,
                method:null,
                body:null,
            },
            role:"Store_Manager"
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">
    
                </div>
                <div class="col-10">  
                    <div class="row row-cols-auto" v-if="categories.length>0">
                        <div class="col" v-for="category in categories">
                            <div class="card custom-card">                                
                                <img :src="getImageUrl(category.id)" class="custom-img" alt="Image">
                                <div class="card-body">
                                    <h5 class="card-title">{{category.name}}</h5>
                                    <p class="card-text">{{category.description}}</p>
                                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasResponsive' + category.id" aria-controls="offcanvasResponsive">
                                        Products
                                    </button>
                                    <div class="offcanvas offcanvas-start text-bg-dark" tabindex="0" :id="'offcanvasResponsive' + category.id" aria-labelledby="offcanvasResponsiveLabel" style="z-index:1200">
                                        <div class="offcanvas-header">
                                            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Products</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" style="background-color:red" aria-label="Close"></button>
                                        </div>
                                        <div class="offcanvas-body">
                                            <div>
                                            All products for <strong style="color:white">{{category.name}}</strong> is shown here.
                                            </div>
                                            <div class="dropdown mt-3" v-for="product in category.products">
                                                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                    {{product.product_name}}
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-dark">
                                                    <li><button class="dropdown-item" data-bs-dismiss="offcanvas" :data-bs-target="'#offcanvasResponsive' + category.id" aria-label="Close" @click="showPopupEditProduct(product.id)">Edit</button></li>
                                                    <li><button type="button" class="dropdown-item" data-bs-toggle="modal" :data-bs-target="'#confirmationModal' + product.id">Delete</button></li>
                                                </ul>
                                                <div class="modal fade" :id="'confirmationModal' + product.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" style="z-index:1300">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content" style="color:black">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                Are you sure you want to delete this product?
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="button" class="btn btn-danger" @click="deleteProduct(product.id)" data-bs-dismiss="modal">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                    <div>
                                        <button @click="showPopupProduct(category.id)" class="btn btn-primary btn-sm">+Add Product</button> 
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <button class="btn btn-warning btn-sm" @click="showPopupEditCategory(category.id)">Edit</button>
                                        </div>
                                        <div class="col">
                                            <button class="btn btn-danger btn-sm" id="deleteButton" data-bs-toggle="modal" :data-bs-target="'#categoryModal' + category.id">Delete</button>
                                        </div>
                                        <div class="modal fade" :id="'categoryModal' + category.id" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="categoryModalLabel">Confirmation</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Are you sure you want to delete this category?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                        <button type="button" class="btn btn-danger" @click="deleteCategory(category.id)" data-bs-dismiss="modal">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>      
                    </div>
                    <div v-else style="font-weight: bolder; font-size:larger">No categories or products created</div>        
                </div>
                <div class="col">
                    
                </div>
            </div>
            <footer>
                <div id="add-button">
                    <button @click="showPopup" class="btn btn-primary btn-lg">+</button>
                    <addCategory ref="child1" :userType="role" @callFetch="fetchCategories"></addCategory>
                </div>
                <addProduct ref="child" @callFetch2="fetchCategories"></addProduct>
                <editProduct ref="child3" @callFetch3="fetchCategories"></editProduct>
                <editCategory ref="child4" :userType="role" @callFetch4="fetchCategories"></editCategory>
            </footer>
        </div>
    `,
    async mounted(){
        this.fetchCategories()
    },
    components:{
        addCategory,
        addProduct,
        editProduct,
        editCategory,
    },
    methods:{
        showPopup() {
            this.$refs.child1.showPopup();
        },
        closePopup() {
            this.$refs.child1.closePopup();
            this.fetchCategories()
        },
        showPopupProduct(categoryId) {
            this.$refs.child.showPopup(categoryId);
        },
        closePopupProduct() {
            this.$refs.child.closePopup();
            this.fetchCategories()
        },
        showPopupEditProduct(productId) {
            this.$refs.child3.showPopup(productId);
        },
        closePopupEditProduct() {
            this.$refs.child3.closePopup();
            this.fetchCategories()
        },
        showPopupEditCategory(categoryId) {
            this.$refs.child4.showPopup(categoryId);
        },
        closePopupEditCategory() {
            this.$refs.child4.closePopup();
            this.fetchCategories()
        },
        async fetchCategories(){
            try{
                const res=await fetch('/api/category',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.categories=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        getImageUrl(categoryId){
            return `/image/${categoryId}`
        },
        async deleteCategory(categoryId){
            const datas=JSON.parse(localStorage.getItem('user'))
            try{
                const formData = new FormData();
                formData.append('json_data', JSON.stringify({
                    'user_id': datas.id,
                    'category_id': categoryId,
                    'method': 'DELETE',
                  }));
                  
                const res=await fetch('/api/manager_requests',{
                    method:'POST',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body:formData
                })
                const data = await res.json()
                console.log(data)
                this.fetchCategories()
                if (res.ok){
                    alert("Request sent for category removal!")
                }else{
                    alert("Some error happened")
                    console.log(data)
                }
            } catch(error){
                console.log(datas.id)
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