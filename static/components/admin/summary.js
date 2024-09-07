export default{
    data(){
        return{
            cat_wise_graph:"",
            cat_wise_graph_2:"",
            error:""
        }
    },
    template:`
        <div class="container text-center main-body">
            <div class="row">
                <div class="col">
                    
                </div>
                <div class="col-16">  
                    {{error}}
                    <img :src="'/' + cat_wise_graph_2" class="img-fluid" alt="Graph 1">
                    <img :src="'/' + cat_wise_graph" class="img-fluid" alt="Graph 2">
                </div>
                <div class="col">
                    
                </div>
            </div>
        </div>
    `,
    async mounted(){
        this.fetchGraph()
    },
    methods:{
        async fetchGraph(){
            try{
                const res=await fetch('/summary',{
                    method:'GET',
                    headers:{
                        'Authentication-Token':localStorage.getItem('auth-token')
                    }
                })
                const data=await res.json()
                if (res.ok){
                    this.cat_wise_graph=data.first
                    this.cat_wise_graph_2=data.second
                }else{
                    this.error="Unable to fetch data"
                }
            }catch(error){
                console.log('Error:',error)
            }
        }
    }
}