import NotLoggedIn  from "./NotLoggedIn.js"
import LoggedIn from "./LoggedIn.js"
import searched from "../customer/searched.js"

const Header={
    data(){
      return{
        searchBar:''
      }
    },
    template:`
      <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top"  data-bs-theme="dark">
        <div class="container-fluid">
          
          <router-link to="/admin_dashboard" v-if="role" class="navbar-brand fst-italic"><strong style="font-size:24px; color:white">Admin Dashboard</strong></router-link>
          <router-link to="/manager_dashboard" v-else-if="manager_role" class="navbar-brand fst-italic"><strong style="font-size:24px; color:white">Manager Dashboard</strong></router-link>
          <router-link to="/" v-else class="navbar-brand"><strong style="font-size:24px; color:white">MyStore</strong></router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1" style="width:70%" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">  
                          
                <li class="nav-item">
                  <router-link to="/" class="nav-link"  exact-active-class="active"> Home </router-link>
                </li>
                <li class="nav-item" v-if="role">
                  <router-link to="/admin_dashboard" class="nav-link"  exact-active-class="active"> Dashboard </router-link>
                </li>
                <li class="nav-item" v-else-if="manager_role">
                  <router-link to="/manager_dashboard" class="nav-link"  exact-active-class="active"> Dashboard </router-link>
                </li>
                <li class="nav-item" v-else>
                  <router-link to="/about" class="nav-link" exact-active-class="active"> About </router-link>
                </li>
                <li class="nav-item" v-if="role || manager_role">
                  <router-link to="/inventory" class="nav-link"  exact-active-class="active"> Inventory </router-link>
                </li>
                <div v-if="isLoggedIn">
                  <LoggedIn/>
                </div>
                <div v-else>
                  <NotLoggedIn/>
                </div>
                
              </ul>
              <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" v-model="searchBar" aria-label="Search">
                <button class="btn btn-outline-success" @click='searching' type="submit">Search</button>
              </form>
            </div>
          </div>
        </div>
      </nav>
    `,  
    components:{
        LoggedIn,
        NotLoggedIn,
    },
    computed:{
      isLoggedIn() {
        return this.$store.state.isAuthenticated;
      },
      role(){
        return this.$store.state.role=='Admin';
      },
      manager_role(){
        return this.$store.state.role=='Store_Manager';
      }
    },
    methods:{
      searching(){
       this.$router.push({name:'search',params:{search:this.searchBar}});
      }
    }

}

export default Header