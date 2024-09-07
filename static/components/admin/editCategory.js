export default{
    props:
        ['userType']
    ,
    data(){
        return{
            isPopupVisible:false,
            message:'',
            categoryId:'',
            category:[],
            formData:{
                name:'',
                description:'',
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
                            <h3 class="card-title">Update Category</h3>
                            <form v-if="userType=='Admin'" @submit.prevent="editCategory(categoryId)">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" name="name" v-model="formData.name" :placeholder="category.name">
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <input type="number" class="form-control" name="rate" v-model="formData.description" :placeholder="category.description">
                                </div>
                                <div class="mb-3">
                                    <label for="image" class="form-label inline-label ">Image <input type="checkbox" id="readCheckbox" name="readCheckbox"> <p class="alert alert-warning" style="font-size: 12px">(Select if you want to change the image)</p></label>
                                    <input class="form-control" @change="onFileChange" type="file" name="image">
                                </div>
                                <button type="submit" value="Upload" class="btn btn-primary">Update</button>
                            </form>
                            <form v-else-if="userType=='Store_Manager'" @submit.prevent="editCategoryRequest(categoryId)">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" name="name" v-model="formData.name" :placeholder="category.name">
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <input type="text" class="form-control" name="rate" v-model="formData.description" :placeholder="category.description">
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
    methods:{
        showPopup(categoryId) {
            this.fetchCategory(categoryId)
            this.categoryId=categoryId
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
            this.formData.description='';
            this.formData.image=null;
        },
        async fetchCategory(categoryId){
            try{
                const res=await fetch('/api/category',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':categoryId
                    }
                })
                const data=await res.json()
                this.category=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        async editCategory(categoryId){
            try {
                const formData = new FormData();
                formData.append('id', categoryId);
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('image', this.formData.image);

                const response = await fetch('/api/category', {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Category updated successfully!";
                    this.closePopup();
                    this.$emit('callFetch4');
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
        async editCategoryRequest(categoryId){
            const datas=JSON.parse(localStorage.getItem('user'))
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('image', this.formData.image);
                formData.append('json_data', JSON.stringify({
                    'user_id': datas.id,
                    'category_id': categoryId,
                    'method': 'PUT',
                  }));

                const response = await fetch('/api/manager_requests', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token':localStorage.getItem('auth-token'),
                    },
                    body: formData,
                });
        
                if (response.ok) {
                    this.message = "Updation request generated!";
                    this.closePopup();
                    this.$emit('callFetch4');
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
    }
}