export default {
  template: `
  <div>
    <h2 class="text-center mt-3">Add New Album</h2>
    <hr>

    <div class="col-md-6 offset-md-3">
      <form @submit.prevent="addAlbum">
        <div class="mb-3">
          <label for="albumName" class="form-label">Album Name:</label>
          <input type="text" class="form-control" id="albumName" v-model="newAlbum.name" required>
        </div>
        <div class="mb-3">
          <label for="albumGenre" class="form-label">Genre:</label>
          <input type="text" class="form-control" id="albumGenre" v-model="newAlbum.genre">
        </div>
        <div class="mb-3">
          <label for="albumArtist" class="form-label">Artist:</label>
          <input type="text" class="form-control" id="albumArtist" v-model="newAlbum.artist">
        </div>
        <button type="submit" class="btn btn-primary">Add Album</button>
      </form>
    </div>
  </div>
  `,
  data() {
    return {
      newAlbum: {
        name: null,
        genre: null,
        artist: null,
      },
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },

  methods: {
    async addAlbum() {
      
        const res = await fetch('/api/albums', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token
          },
          body: JSON.stringify(this.newAlbum)
        })

        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          // Optionally, redirect to a different page after successful addition
          // this.$router.push('/albums'); // Example route change
          // Clear the form after successful addition
          this.newAlbum = { name: null, genre: null, artist: null }
        } else {
          this.error = data.message;
        }
      } 
    }
  }



  