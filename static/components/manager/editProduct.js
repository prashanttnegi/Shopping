export default{
    data(){
        return{
            isPopupVisible:false,
            message:'',
            productId:'',
            categories:[],
            product:[],
            units:[],
            formData:{
                name:'',
                category:'',
                rate:'',
                quantity:'',
                image:null,
            },
        }
    },
    template:
        `
            <div v-if="isPopupVisible" class="popup">
                <div class="popup-content">
                    <button @click="closePopup" class="close-button">&times;</button>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Update Product</h3>
                            <form  @submit.prevent="editProduct(productId)">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" name="name" v-model="formData.name" :placeholder="product.product_name">
                                </div>
                                <div class="mb-3">
                                    <label for="category" class="form-label">Category</label>
                                    <select name="category" id="category" v-model="formData.category" class="form-select">
                                        <option disabled selected value="">Choose a category</option>
                                        <option v-for="cat in categories" :value="cat.id">{{cat.name}}</option>                                        
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="rate" class="form-label">Rate</label>
                                    <input type="number" class="form-control" name="rate" v-model="formData.rate" :placeholder="product.unit">
                                </div>
                                <div class="mb-3">
                                    <label for="quantity" class="form-label">Quantity</label>
                                    <input type="number" class="form-control" name="quantity" v-model="formData.quantity" :placeholder="product.quantity">
                                </div>
                                <div class="mb-3">
                                    <label for="image" class="form-label inline-label ">Image <input type="checkbox" id="readCheckbox" name="readCheckbox"> <p class="alert alert-warning" style="font-size: 12px">(Select if you want to change the image)</p></label>
                                    <input class="form-control" @change="onFileChange" type="file" name="image">
                                </div>
                                <button type="submit" value="Upload" class="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `
    ,
    async mounted(){
        this.fetchUnits()
        this.fetchCategories()
    },
    methods:{
        showPopup(productId) {
            this.fetchProduct(productId)
            this.productId=productId
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
            this.clearForm();
        },
        onFileChange(event) {
            this.formData.image = event.target.files[0];
        },
        clearForm() {
            this.formData.name='';
            this.formData.category='';
            this.formData.rate='';
            this.formData.quantity='';
            this.formData.image=null;
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
        async editProduct(productId){
            try {
                const formData = new FormData();
                formData.append('id', productId);
                formData.append('category_id', this.formData.category);
                formData.append('name', this.formData.name);
                formData.append('rate', this.formData.rate);
                formData.append('quantity', this.formData.quantity);
                formData.append('image', this.formData.image);

                const response = await fetch('/api/product', {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token')
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Product updated successfully!";
                    this.closePopup();
                    this.$emit('callFetch3');
                    alert(this.message);
                } else if (response.status === 400) {
                    this.message = "Wrong data inputs!";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
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
        async fetchUnits(){
            try{
                const res=await fetch('/unit',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data= await res.json()
                this.units=data
            }catch(error){
                console.log('Error:',error)
            }
        }
    }
}