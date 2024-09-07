export default{
    template:`
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profile
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
                <li><router-link to="/login" class="dropdown-item" exact-active-class="active"> Login </router-link></li>
                <li>
                <hr class="dropdown-divider">
                </li>
                <li><router-link to="/register" class="dropdown-item" exact-active-class="active"> Register </router-link></li>
            </ul>
        </li>
    `
}