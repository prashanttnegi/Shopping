export default{
    data(){
        return{
            product:[],
            isPopupVisible:false,
            productId:'',
            formData:{
                quantity:'',
                total:0,
            },
            error:''
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
                        <h3 style="margin-top: 30px" class="card-title">{{product.product_name}}</h3>
                        <br>
                        <h5 v-if="product.quantity>0">Availibilty : {{product.quantity}}</h5>
                        
                        <h5 v-else style="color:red">Availibilty : Out Of Stock</h5>
                        
                        <br>
                        <form @submit.prevent="addCart(product.id)">
                            <div class="row g-3 align-items-center">
                                <div class="col">
                                    <div class="row g-3 align-items-center">
                                        <div class="col-auto">
                                        <label for="quantity" class="col-form-label">Quantity</label>
                                        </div>
                                        <div class="col-auto">
                                        <input type="number" class="form-control" v-model="formData.quantity" name="quantity" @input="updatePlaceholder" placeholder="Enter the quantity" required>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="row g-3 align-items-center">
                                        <div class="col-auto">
                                            <label for="price" class="form-label">Price</label>
                                        </div>
                                        <div class="col-auto">
                                            <input class="form-control" name="rate" style="text-align: right; width: 100px; height: 30px;" type="number" disabled :placeholder=product.rate>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="row g-3 align-items-center">
                                        <div class="col-auto">
                                        <label for="total" class="col-form-label">Total</label>
                                        </div>
                                        <div class="col-auto">
                                        <input type="number" class="form-control" name="total" :placeholder="'₹ ' + formData.total" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <img :src="getImageUrl(productId)" class="product-image" alt="Image">
                                </div>
                            </div>
                            <br>
                            <button v-if="product.quantity > 0" type="submit" value="Upload" class="btn btn-primary" :disabled="isQuantityExceeded">Add to Cart</button>
                            <button v-else type="submit" value="Upload" class="btn btn-primary" disabled>Out of stock</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    `,
    computed:{
        isQuantityExceeded(){
            return this.formData.quantity > this.product.quantity
        }
    },
    methods:{
        showPopup(productId) {
            this.fetchProduct(productId)
            this.productId=productId
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
            this.resetForm()
        },
        getImageUrl(id){
            return `/product_image/${id}`
        },
        async fetchProduct(productId){
            try{
                const res=await fetch('/api/product',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':productId
                    }
                })
                const data=await res.json()
                this.product=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        updatePlaceholder() {
            const quantityInput = this.formData.quantity;
            if (quantityInput > this.product.quantity) {
                this.error = "Quantity is greater than available quantity";
            }else{
                this.error=''
            }
            const rate = this.product.rate; // Assuming rate is part of your data properties
            const cost = quantityInput * rate;
            this.formData.total = `${cost}`;
        },
        async addCart(productId){
            try{
                const formData = new FormData();
                formData.append('user_id', this.$store.state.user.id)
                formData.append('product_id', productId)
                formData.append('quantity', this.formData.quantity)
                formData.append('total', this.formData.total)

                const response = await fetch('/api/cart', {
                    method:'POST',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: formData,
                })

                if (response.ok){
                    alert('Product added to cart successfully!')
                    this.closePopup()
                    this.$emit('callFetch')
                }
            } catch (err){
                this.message="An error has been occurred"
                console.log(err)
            }
        },
        resetForm() {
            this.formData.quantity = 0;
            this.formData.total = 0;
        }
    }
}