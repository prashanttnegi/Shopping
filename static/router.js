import login from './components/customer/login.js';
import Main  from './components/customer/main.js';
import register from './components/customer/register.js';
import adminDashboard  from './components/admin/adminDashboard.js';
import Manager_register from './components/manager/Manager_register.js';
import manager_dashboard from './components/manager/manager_dashboard.js';
import store from './store.js';
import requests from './components/admin/requests.js';
import cart from './components/customer/cart.js';
import searched from './components/customer/searched.js';
import profile from './components/customer/profile.js';
import about from './components/customer/about.js';
import inventory from './components/manager/inventory.js';
import summary from './components/admin/summary.js';

const routes=[
    {path:'/',component:Main, name:'home'},
    {path:'/admin_dashboard', component:adminDashboard, name:'admin_dashboard'},
    {path:'/manager_dashboard', component:manager_dashboard, name:'manager_dashboard'},
    {path:'/login',component:login, name:'login'},
    {path:'/register',component:register, name:'register'},
    {path:'/manager_registration',component:Manager_register, name:'manager_register'},
    {path:'/requests', component:requests, name:'requests'},
    {path:'/cart', component:cart, name:'cart'},
    {path:'/search', component:searched, name:'search'},
    {path:'/profile', component:profile, name:'profile'},
    {path:'/about', component:about, name:'about'},
    {path:'/inventory', component:inventory, name:'inventory'},
    {path:'/summary', component:summary, name:'summary'},
]

const router= VueRouter.createRouter({
    history:VueRouter.createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.name!=='register' && to.name!=='manager_register' &&to.name!=='home' &&to.name!=='about') {
        if (!store.state.isAuthenticated){
            next({ name: 'login' })
        } 
        else if (to.name=='admin_dashboard'){

            if (store.state.role !== 'Admin'){
                next({name:'login'})
            } else{
                next()
            }
        }
        else if (to.name=='manager_dashboard'){

            if (store.state.role !== 'Store_Manager'){
                next({name:'login'})
            } else{
                next()
            }

        }else{
            next()
        }
    } else {
        next()
    }
})

export default router