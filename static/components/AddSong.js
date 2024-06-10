export default {
    template: `
    
    <div>
    <h1 class="text-center">Add a New Song</h1>
    <form @submit.prevent="addSong" class="container">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" id="title" v-model="song.title" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="lyrics" class="form-label">Lyrics</label>
        <textarea id="lyrics" v-model="song.lyrics" class="form-control" required></textarea>
      </div>
      <div class="mb-3">
        <label for="duration" class="form-label">Duration(in sec)</label>
        <input type="number" id="duration" v-model="song.duration" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="rating" class="form-label">Rating (1-10)</label>
        <input type="number" id="rating" v-model="song.rating" class="form-control" min="1" max="10" required>
      </div>
      <button type="submit" class="btn btn-primary">Create Song</button>
    </form>
  </div>
    `,
    data() {
      return {
        albumId: this.$route.params.albumId,
        song: {
          title: '',
          lyrics: '',
          duration: null,
          rating: null
        },
        token: localStorage.getItem('auth-token')
      }
    },
    methods: {
      async addSong() {
            try {
            const response = await fetch(`/api/songs/${this.albumId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token
                },
                body: JSON.stringify(this.song)
            })
    
            const data = await response.json()
            if (response.ok) {
                alert(data.message)            
                this.$router.push('/')
            } 
            else {
                alert(data.message || 'Failed to add song')
            }
            } catch (error) {
            console.error('Error adding song:', error)
            alert('An error occurred while adding the song')
            }
        }
    }
  }