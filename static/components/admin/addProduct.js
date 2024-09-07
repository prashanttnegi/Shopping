export default{
    data(){
        return{
            isPopupVisible:false,
            message:'',
            units:[],
            formData:{
                name:'',
                unit:'',
                rate:'',
                quantity:'',
                image:null,
            },
            currentCategory:null,
        }
    },
    template:`
        <div v-if="isPopupVisible" class="popup">
            <div class="popup-content">
                <button @click="closePopup" class="close-button">&times;</button>
                <div class="card">
                    <div v-if="message">{{message}}</div>
                    <div class="card-body">
                        <form @submit.prevent="registerProduct">
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                <label for="product_name" class="col-form-label">Product Name</label>
                                </div>
                                <div class="col-auto">
                                <input type="text" class="form-control" name="name" placeholder="Tea, Potato, etc." v-model="formData.name" required>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                <label for="unit" class="col-form-label">Unit</label>
                                </div>
                                <div class="col-auto">
                                    <select name="unit" id="unit" class="form-select" v-model="formData.unit" required>
                                        <option disabled selected value="">Choose a Unit</option>
                                        <option v-for="unit in units" :value="unit">{{unit}}</option>
                                    </select>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <label for="rate" class="form-label">Rate/Unit</label>
                                </div>
                                <div class="col-auto">
                                    <input class="form-control" type="number" name="rate" v-model="formData.rate" required>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                <label for="quantity" class="col-form-label">Quantity</label>
                                </div>
                                <div class="col-auto">
                                <input type="number" class="form-control" name="quantity" v-model="formData.quantity" required>
                                </div>
                            </div>
                            <br>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                <label for="image" class="col-form-label">Image</label>
                                </div>
                                <div class="col-auto">
                                <input type="file" @change="onFileChange" class="form-control" name="image" required>
                                </div>
                            </div>
                            <br>
                            <button type="submit" value="Upload" class="btn btn-primary">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    async mounted(){
        this.fetchUnits()
    },
    methods:{
        showPopup(categoryId) {
            this.currentCategory=categoryId
            this.isPopupVisible = true;
        },
        closePopup() {
            this.clearForm();
            this.isPopupVisible = false;
        },
        onFileChange(event) {
            this.formData.image = event.target.files[0];
        },
        clearForm() {
            this.formData.name='';
            this.formData.unit='';
            this.formData.rate='';
            this.formData.quantity='';
            this.formData.image=null;
        },
        async registerProduct() {
            try {
                const formData = new FormData();
                formData.append('category_id', this.currentCategory);
                formData.append('name', this.formData.name);
                formData.append('unit', this.formData.unit);
                formData.append('rate', this.formData.rate);
                formData.append('quantity', this.formData.quantity);
                formData.append('image', this.formData.image);

                const response = await fetch('/api/product', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Product added successfully!";
                    alert(this.message)
                    this.closePopup();
                    this.$emit('callFetch2');
                } else if (response.status === 400) {
                    this.message = "Category already exists!";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
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