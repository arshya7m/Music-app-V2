export default {
    template:`

    <div>
    <h1 class="text-center">Edit Album</h1>
    <form @submit.prevent="updateAlbum" class="container">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" v-model="album.name" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="genre" class="form-label">Genre</label>
        <input type="text" id="genre" v-model="album.genre" class="form-control">
      </div>
      <div class="mb-3">
        <label for="artist" class="form-label">Artist</label>
        <input type="text" id="artist" v-model="album.artist" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Update Album</button>
    </form>
  </div>
    `,
    data() {
      return {
        albumId: this.$route.params.albumId,
        album: {
          name: '',
          genre: '',
          artist: ''
        },
        token: localStorage.getItem('auth-token')
      };
    },
    methods: {
      async updateAlbum() {
        try {
          const res = await fetch(`/api/albums/${this.albumId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token
            },
            body: JSON.stringify({
              name: this.album.name,
              genre: this.album.genre,
              artist: this.album.artist
            })
          });
          const data = await res.json();
          if (res.ok) {
            alert(data.message)
            this.$router.push('/')

          } 
          else {
            alert(data.message)           

          }
        } catch (error) {
          console.error('Error updating album:', error);
        }
      }
    },
    async mounted() {
      try {
        const res = await fetch(`/api/albums/${this.albumId}`, {
          headers: {
            'Authentication-Token': this.token
          }
        })
        const data = await res.json();
        if (res.ok) {
          this.album = data
        } else {
          alert(data.message)
        }
      } catch (error) {
        console.error('Error fetching album:', error);
      }
    }
  }