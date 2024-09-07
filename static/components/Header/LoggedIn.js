export default{
    data(){
        return{
            role:localStorage.getItem('role')
        }
    },
    template:`
        <li class="nav-item"></li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profile
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
                <li><router-link to="/profile" class="dropdown-item" exact-active-class="active"> Account </router-link></li>
                <li v-if="role=='Admin'"><router-link to="/requests" class="dropdown-item" exact-active-class="active"> Requests </router-link></li>
                <li v-if="role=='Admin'"><router-link to="/summary" class="dropdown-item" exact-active-class="active"> Summary </router-link></li>
                <li v-else-if="role=='Store_Manager'"><button class="btn" @click="downloadReport">Product Report</button></li>
                <li><router-link to="/cart" class="dropdown-item" exact-active-class="active"> Cart </router-link></li> 
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li><button @click="logout" class="dropdown-item"> Logout </button></li>
            </ul>
        </li>
    `,
    methods:{
        logout(){
            localStorage.removeItem('user')
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$store.state.isAuthenticated=false
            this.$store.state.user=null
            this.$store.state.role=null
            fetch('/logout').then((res)=>{
                if (res.ok){
                    this.$router.push({name:'login'})
                }
            })
        },
        async downloadReport(){
            const res= await fetch('/download_csv',{
                method:'GET',
                headers:{
                    'Authentication-Token':localStorage.getItem('auth-token')
                }
            })
            const data=await res.json()
            if (res.ok){
                const taskId=data['task_id']
                const intv=setInterval(async()=>{
                    const csv_res=await fetch(`/get_csv/${taskId}`)
                    if (csv_res.ok){
                        clearInterval(intv)
                        window.location.href=`/get_csv/${taskId}`
                        alert("Report downloaded successfully")
                    }
                },1000)
            }else{
                console.log(data)
                alert('You are not authorized!')
            }
        }
    }
}