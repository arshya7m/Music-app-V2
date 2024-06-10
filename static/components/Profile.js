
export default {
    template:`<div >
    <h1 class="text-center">User Profile</h1>
    <div class="d-flex justify-content-center">
        <form @submit.prevent="updateProfile" >
        <label for="username" class="form-label">Username:</label>
        <input type="text" id="username" v-model="userData.username" class="form-control">

        <label for="email"class="form-label">Email:</label>
        <input type="email" id="email" v-model="userData.email" class="form-control" required >

        <label for="name" class="form-label">Name:</label>
        <input type="text" id="name" v-model="userData.name" class="form-control">

        <label for="currentPassword" class="form-label">Current Password:</label>
        <input type="password" id="currentPassword" v-model="currentPassword" class="form-control">
        <label for="newPassword" class="form-label">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword" class="form-control"><br><br>

        <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
    </div>
    
  </div>`,
  data() {
    return {
      userData: {
        username: '',
        email: '',
        name: ''
      },
      currentPassword: '',
      newPassword: '',
      token: localStorage.getItem('auth-token'),
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await fetch('/api/user-profile', {
          headers: {
            'Authentication-Token': this.token,
          }
        });
        const data = await response.json();
        this.userData = data
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    },
    async updateProfile() {
      try {
        const updated_data = {
          email: this.userData.email,
          username: this.userData.username,
          name: this.userData.name,
          current_password: this.currentPassword,
          new_password: this.newPassword
        }
        const response = await fetch('/api/user-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token')
          },
          body: JSON.stringify(updated_data)
        })
        const data = await response.json();
        if (response.ok) {
          alert(data.message)
        } else {
          alert(data.message)
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }
  },
  mounted() {
    this.fetchUserProfile() 
  }
}
