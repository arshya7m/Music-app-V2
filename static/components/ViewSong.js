export default {
    template: `
        <div v-if="song" class="container mt-5">
        <h2>Song name: {{ song.title }}</h2>
        <p><h4>Duration: {{ song.duration }} seconds</h4></p>

        <div class="col-md-3 mt-3">
        <label for="ratingInput">Rate this song (1-10):</label>
        <input id="ratingInput" type="number" min="1" max="10" v-model="rating" class="form-control">
        <button @click="rateSong" class="btn btn-primary mt-2">Rate</button>
        </div>

        <div class="card mt-5">
        <div class="card-body">
            <h3 class="card-title">Lyrics</h3>
            <pre class="card-text">{{ song.lyrics }}</pre>
        </div>
        </div>
    </div>

        <div v-else>
            <p>Loading...</p>
        </div>
    `,
    data() {
      return {
        song: null,
        rating: null,
        token: localStorage.getItem('auth-token'),
        songId: this.$route.params.songId
      }
    },
    methods: {
      async rateSong() {
        try {
          const res = await fetch(`/api/song/rate/${this.songId}`, {
            method: 'PUT',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: this.rating })
          });
          const data = await res.json()
          if (res.ok) {
            alert(data.message)
          }
        } catch (error) {
          console.error('Error rating song:', error);
        }
      },
      async loadSongDetails() {
        try {
          const res = await fetch(`/api/songs/${this.songId}`, {
            headers: {
              'Authentication-Token': this.token,
            }
          });
          if (res.ok) {
            const data = await res.json();
            this.song = data;
          }
        } catch (error) {
          console.error('Error loading song details:', error);
        }
      }
    },
    created() {
      this.loadSongDetails();
    }
  }
  