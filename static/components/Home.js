import AdminHome from "./AdminHome.js"
import CreatorHome from "./CreatorHome.js"
import UserHome from "./UserHome.js"


export default {
    template: `<div>
    <UserHome v-if="userRole=='user'"/>
    <AdminHome v-if="userRole=='admin'" />
    <CreatorHome v-if="userRole=='creator'" />
    </div>`,

    data() {
        return {
          userRole: localStorage.getItem('role'),
          authToken: localStorage.getItem('auth-token'),
          
        }
      },
    

    components: {
        AdminHome,
        CreatorHome,
        UserHome,
    },
}