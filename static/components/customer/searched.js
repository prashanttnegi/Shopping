import addToCart from "./addToCart.js";

export default{
    data(){
        return{
            searched:'',
            error:''
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">

                </div>
                <div class="col-10" v-if="searched.item==='Category'">
                    <h3>{{searched.result.name}}</h3>
                    <div class="rectangular-card">
                        <div v-for="product in searched.result.products">
                            <button class="inner-card"  v-if="searched.result.products.length > 0" @click=showPopupProduct(product.id)>
                                <img :src="getImageUrl(product.id)" class="product-image" alt="Image">
                                <div class="product-details">
                                    <label class="inline-label"><h5 class="card-title">{{product.product_name}}</h5>
                                    <h5><p class="card-text">{{product.rate}}{{product.unit}}</p></h5></label>
                                </div>
                            </button>
                        </div>
                    </div>
                    <br>
                    <br>
                </div>
                <div class="col-10" v-else-if="searched.item==='Product'">
                    <h3>Products</h3>
                    <div class="rectangular-card">                        
                        <button class="inner-card" v-for="product in searched.result" @click=showPopupProduct(product.id)>
                            <img :src="getImageUrl(product.id)" class="product-image" alt="Image">
                            <div class="product-details">
                                <label class="inline-label"><strong class="card-title">{{product.product_name}}</strong>
                                <strong><p class="card-text">{{product.rate}}{{product.unit}}</p></strong></label>
                            </div>
                        </button>
                    </div>
                </div>
                <addToCart ref="child" @callFetch="fetchSearch(searchBar)"></addToCart>
                <div class="col">
                    <h4>{{error}}</h4>
                </div>
            </div>
        </div>
    `,
    components:{
        addToCart
    },
    async mounted(){
        const searchBar=this.$route.params.search;
        this.fetchSearch(searchBar);
    },
    methods:{
        showPopupProduct(id){
            if (this.$store.state.isAuthenticated == false){
                this.$router.push('/login')
            }
            this.$refs.child.showPopup(id);
        },
        async fetchSearch(searchBar){
            try{
                const formData=new FormData();
                formData.append('search',searchBar);
                const res=await fetch('/api/search',{
                  method:'POST',
                  headers:{
                    'Authentication-Token':localStorage.getItem('auth-token'),
                  },
                  body: formData,
                })
                const data=await res.json();
                if (res.ok){
                  this.searched=data;
                }
              }catch(error){
                console.log(error);
                this.error=error;
              }
        },
        getImageUrl(id){
            return `/product_image/${id}`
        },
    }
}