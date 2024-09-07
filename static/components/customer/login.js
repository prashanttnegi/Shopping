export default {
    template:`
        <div class="container main-body">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <p v-if="error" class="warning" style="color:red">{{error}}</p>
                            <h3 class="card-title">Login</h3>
                            <form>
                                <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Email address</label>
                                <input type="email" v-model='credential.email' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <input type="password" v-model='credential.password' class="form-control" id="exampleInputPassword1">
                                </div>
                                <button @click='loginUser' class="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    data(){
        return{
            credential:{
                email:null,
                password:null
            },
            error:null
        }
    },
    methods:{
        async loginUser(){
            try{
                const res=await fetch('/user_login',{
                    method:'POST',
                    body:JSON.stringify(this.credential),
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                const data=await res.json()
                if(res.ok){
                    localStorage.setItem('auth-token',data.token)
                    localStorage.setItem('role',data.roles)
                    localStorage.setItem('user',JSON.stringify(data))
                    this.$store.state.isAuthenticated=true
                    this.$store.state.role=data.roles
                    this.$store.state.user=data
                    const datas= this.$store.state.user
                    if (datas.roles.includes('Admin')){
                        this.$router.push({name:'admin_dashboard'})
                    }else if (datas.roles.includes('Store_Manager')){
                        this.$router.push({name:'manager_dashboard'})
                    }else{
                        this.$router.push({name:'home'})
                    }
                }else{
                    this.error=data.error
                    console.log(data)
                }
            }catch(error){
                console.log(error)
            }
        },
    }
}