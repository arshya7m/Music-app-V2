export default {
    template:`
    <div>
    <h1 class="text-center">Edit Song</h1>
    <form @submit.prevent="updateSong" class="container">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" id="title" v-model="song.title" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="lyrics" class="form-label">Lyrics</label>
        <textarea id="lyrics" v-model="song.lyrics" class="form-control" required></textarea>
      </div>
      <div class="mb-3">
        <label for="duration" class="form-label">Duration</label>
        <input type="number" id="duration" v-model="song.duration" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="rating" class="form-label">Rating (1-10)</label>
        <input type="number" id="rating" v-model="song.rating" class="form-control" min="1" max="10" required>
      </div>
      <button type="submit" class="btn btn-primary">Update Song</button>
    </form>
  </div>
    `,
    data() {
      return {
        songId: this.$route.params.songId,
        song: {
          title: '',
          lyrics: '',
          duration: null,
          rating: null
        },
        token:localStorage.getItem('auth-token')
      }
    },
    methods: {
      async updateSong() {
        try {
          const res = await fetch(`/api/songs/${this.songId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token
            },
            body: JSON.stringify({
              title: this.song.title,
              lyrics: this.song.lyrics,
              duration: this.song.duration,
              rating: this.song.rating
            })
          })
          const data = await res.json()
          if (res.ok) {
            alert(data.message)
            this.$router.push('/')
          }
           else {
            alert(data.message)
          }
        } catch (error) {
          console.error('Error updating song:', error)
        }
      }
    },
    async mounted() {
      try {
        const res = await fetch(`/api/songs/${this.songId}`, {
          headers: {
            'Authentication-Token': this.token
          }
        });
        const data = await res.json()
        if (res.ok) {
          this.song = data
        } 
        else {
          alert(data.message)
        }
      } catch (error) {
        console.error('Error fetching song:', error)
      }
    }
  }