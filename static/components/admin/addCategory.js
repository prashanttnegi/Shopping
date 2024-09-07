export default{
    props:['userType'],
    data(){
        return{
            isPopupVisible:false,
            message:'',
            formData:{
                name:'',
                description:'',
                image:null,
            }
        }
    },
    template:`
        <div v-if="isPopupVisible" class="popup">
            <div class="popup-content">
                <button @click="closePopup" class="close-button">&times;</button>
                <div class="card">
                    <div v-if="message">{{message}}</div>
                    <div class="card-body">
                        <form v-if="userType=='Admin'" @submit.prevent="registerCategory()">
                            <label for="category_name" class="form-label">Category Name</label>
                            <input class="form-control form-control-lg" type="text" v-model="formData.name" name="name" placeholder="Ex- Beverages" aria-label=".form-control-lg example" required>
                            <label for="description" class="form-label">Description</label>
                            <input class="form-control" type="text" name="description" v-model="formData.description" placeholder="Beverages includes Soft drinks, Juices etc " aria-label="default input example" required>
                            <label for="image" class="form-label">Image</label>
                            <input class="form-control" @change="onFileChange" type="file" name="image" required>
                            <br>
                            <button type="submit" value="Upload" class="btn btn-primary">Add</button>
                        </form >
                        <form v-if="userType=='Store_Manager'" @submit.prevent="registerCategoryRequest()">
                            <label for="category_name" class="form-label">Category Name</label>
                            <input class="form-control form-control-lg" type="text" v-model="formData.name" name="name" placeholder="Ex- Beverages" aria-label=".form-control-lg example" required>
                            <label for="description" class="form-label">Description</label>
                            <input class="form-control" type="text" name="description" v-model="formData.description" placeholder="Beverages includes Soft drinks, Juices etc " aria-label="default input example" required>
                            <label for="image" class="form-label">Image</label>
                            <input class="form-control" @change="onFileChange" type="file" name="image" required>
                            <br>
                            <button type="submit" value="Upload" class="btn btn-primary">Add</button>
                        </form >
                    </div>
                </div>
            </div>
        </div>
    `,
    methods:{
        showPopup() {
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
            this.formData.description='';
            this.formData.image=null;
        },
        async registerCategory() {
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('image', this.formData.image);

                const response = await fetch('/api/category', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token')
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Category added successfully!";
                    this.closePopup();
                    this.$emit('callFetch');
                    alert(this.message)
                } else if (response.status === 400) {
                    this.message = "Category already exists!";
                    console.log(response.statusText);
                    console.log(await response.text());
                    alert(this.message)
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },
        async registerCategoryRequest() {
            const datas=JSON.parse(localStorage.getItem('user'))
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('image', this.formData.image);
                formData.append('readCheckbox',"on")
                formData.append('json_data', JSON.stringify({
                    'user_id': datas.id,
                    'category_id':null,
                    'method': 'POST',
                  }));

                const response = await fetch('/api/manager_requests', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token')
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Category addition request generated!";
                    this.closePopup();
                    this.$emit('callFetch');
                    alert(this.message)
                } else if (response.status === 400) {
                    this.message = "Category already exists!";
                    console.log(response.statusText); // Should provide additional details about the error
                    console.log(await response.text());
                    alert(this.message)
                }
            } catch (err) {
                // Handle network or other errors
                this.message = "An error occurred. Please try again later.";
                console.error(err);
            }
        },  
    }
}