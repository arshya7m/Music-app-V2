export default {
    template: `
    <div class='d-flex justify-content-center mt-5'>
      <div class="mb-3">
          <div class='text-danger'>{{ error }}</div>
          <label for="email" class="form-label">Email address:</label>
          <input type="email" class="form-control" id="email" placeholder="name@example.com" v-model="cred.email">
          <label for="password" class="form-label">Password:</label>
          <input type="password" class="form-control" id="password" v-model="cred.password">
          <label for="name" class="form-label">Name:</label>
          <input type="text" class="form-control" id="name" v-model="cred.name">
          <label for="username" class="form-label">Username:</label>
          <input type="text" class="form-control" id="username" v-model="cred.username">
          <div>
            <label for="role">Select Role:</label>
            <input type="radio" id="creator" value="creator" v-model="cred.role">
            <label for="creator">Creator</label>
            <input type="radio" id="user" value="user" v-model="cred.role">
            <label for="user">User</label>
          </div>
          <button class="btn btn-primary mt-2" @click="register">Register</button>
      </div>
    </div>
    `,
    data() {
      return {
        cred: {
          email: null,
          password: null,
          name: null,
          username: null,
          role: 'user', // Default role as 'user'
        },
        error: null,
      }
    },
    methods: {
      async register() {
        const res = await fetch('/user-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        })
        const data = await res.json();
        if (res.ok) {
          this.$router.push({ path: '/login' }); // Redirect to Login page after successful registration
        } else {
          this.error = data.message;
        }
      },
    },
  };
  