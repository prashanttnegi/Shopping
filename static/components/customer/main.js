import addToCart from "./addToCart.js";

const Main={
    data(){
        return{
            categories:null,
            token:localStorage.getItem('auth-token')
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">

                </div>
                <div class="col-10">
                    <div v-for="category in categories" :key="category.id">
                        <h3>{{category.name}}</h3>
                        <div class="rectangular-card">
                            <button class="inner-card"  v-for="product in category.products" v-if="category.products.length > 0" @click=showPopupProduct(product.id)>
                                <img :src="getImageUrl(product.id)" class="product-image" alt="Image">
                                <div class="product-details">
                                    <label class="inline-label"><strong class="card-title">{{product.product_name}}</strong>
                                        <strong v-if="product.quantity > 0"><p class="card-text">{{product.rate}} {{product.unit}}</p></strong>
                                        <strong style="color:red" v-else>Out of Stock</strong>
                                    </label>                                        
                                </div>
                            </button>
                            <p class="text-center" v-else><strong class="text-danger">No products for this category</strong></p>
                        </div>
                        <br>
                        <br>
                    </div>
                    <addToCart ref="child" @callFetch="fetchCategories"></addToCart>
                </div>
                <div class="col">

                </div>
            </div>
        </div>
    `,
    async mounted(){
        this.fetchCategories()
    },
    components:{
        addToCart
    },
    methods:{
        showPopupProduct(id){
            if (this.$store.state.isAuthenticated == false){
                this.$router.push('/login')
            }
            this.$refs.child.showPopup(id);
        },
        getImageUrl(id){
            return `/product_image/${id}`
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
            
        }
    }    
}

export default Main;