import Header from './components/Header/header.js'
import router from './router.js'
import store from './store.js';

const {createApp, component}=Vue

const app=createApp({
    template:`
        <Header/>
        <router-view/>
    `,
    components:{
        Header,
    },
    data(){
        return {


        }
    },
    methods:{

    }
});

app.use(router);
app.use(store);
app.mount('#app');