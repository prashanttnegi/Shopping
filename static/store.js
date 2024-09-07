const {createStore}=Vuex

const store=createStore({
    state(){
        return{
            isAuthenticated:localStorage.getItem('auth-token')?true:false,
            user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
            role:localStorage.getItem('role')?localStorage.getItem('role'):null,
        }
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        }
    }
})

export default store