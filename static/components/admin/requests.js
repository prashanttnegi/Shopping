export default{
    data(){
        return{
            users:[],
            requests:[]
        }
    },
    
    template:`
        <div class="container text-center main-body" >
            <div class="row">
                <div class="col">

                </div>
                <div class="col-10">
                    <div v-if="users.length>0">
                        <h5>New Managers Request</h5>
                        <ul class="list-group">
                            <li class="list-group-item" v-for="user in users">
                                {{user.email}}
                                <button class="btn btn-primary" @click="activate_user(user.id)"> Approve </button>
                            </li>                        
                        </ul>
                    </div>
                    <div v-else>
                        <h5>No new manager requests</h5>
                    </div>

                    <hr>

                    <div v-if="requests.length>0">
                        <h5>Managers change requests</h5>
                        <ul class="list-group" style="margin-top:20px">
                            <li class="list-group-item" v-for="request in requests">
                                <span style="float:center">{{request.method}}{{request.id}}</span>
                                <span style="float:right"><button class="btn btn-success" @click="approveRequest(request.id)"> Approve </button></span>                           
                                <span style="float:right; margin-right:5px"><button class="btn btn-danger" @click="deleteRequest(request.id)"> Delete </button></span>                           
                            </li>                        
                        </ul>
                    </div>
                    <div v-else>
                        <h5>No new change requests</h5>
                    </div>
                </div>
                <div class="col">
                </div>
            </div>
        </div>
        
    `,
    async mounted(){
        this.fetchUsers(),
        this.fetchRequests()
    },
    methods:{
        async fetchUsers(){
            try{
                const res=await fetch('/api/users',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.users=data
            } catch(error){
                console.log('Error:',error)
            }
            
        },
        async activate_user(id){
            try{
                const res=await fetch('/api/users',{
                    method:'PATCH',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                })
                const data=await res.json()
                if (res.ok){
                    alert(data.message)
                }else{
                    alert(data.message)
                    console.log(data)
                }
                this.fetchUsers()
            } catch(error){
                console.log('Error:',error)
            }
            
        
        },
        async fetchRequests(){
            try{
                const res=await fetch('/api/manager_requests',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                this.requests=data
            } catch(error){
                console.log('Error:',error)
            }
        },
        async approveRequest(id){
            try{
                const res=await fetch('/api/manager_requests',{
                    method:'PATCH',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                })
                const data=await res.json()
                if (res.ok){
                    alert(data.message)
                }else{
                    alert(data.message)
                    console.log(data)
                }
                this.fetchRequests()
            } catch(error){
                console.log('Error:',error)
            }        
        },
        async deleteRequest(id){
            try{
                const res=await fetch('/api/manager_requests',{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token'),
                        'id':id
                    }
                })
                const data=await res.json()
                if (res.ok){
                    alert(data.message)
                }else{
                    alert(data.message)
                    console.log(data)
                }
                this.fetchRequests()
            } catch(error){
                console.log('Error:',error)
            }
        }

    }
}