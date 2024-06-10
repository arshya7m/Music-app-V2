export default {
    template:`
    <div class="container mt-5">
    <h2 class="text-center">Create Playlist</h2>

    <form @submit.prevent="createPlaylist">
      <div class="form-group mb-3">
        <label for="playlistName">Playlist Name:</label>
        <input type="text" id="playlistName" v-model="playlistName" class="form-control">
      </div>

      <div class="form-group">
        <label>Select Songs:</label>
        <div v-for="song in allsongs" :key="song.id">
          <input type="checkbox" :value="song.id" v-model="selectedSongs">
          <label>{{ song.title }}</label>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-2">Create Playlist</button>
    </form>
  </div>
    
    
    `,
    data() {
      return {
        playlistName: 'No name',
        selectedSongs: [],
        allsongs: [] ,
        token: localStorage.getItem('auth-token'),
      }
    },
    methods: {
      async createPlaylist() {
        try {
          // Make API call to create playlist with selected songs
          const res = await fetch('/api/playlists', {
            method: 'POST',
            headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: this.playlistName,
              songs: this.selectedSongs
            })
          })
  
          if (res.ok) {
            const data = await res.json()
            alert(data.message)
            this.playlistName = 'No name'
            this.selectedSongs = []
          } 
          else {
            const errorData = await res.json()
            alert(errorData.message); // Display error message
          }
        } catch (error) {
          console.error('Error creating playlist:', error);
        }
      },
      async fetchSongs() {
        try {
          const res = await fetch('/api/songs',{
          headers:{
            'Authentication-Token': this.token
          }
        })
          if (res.ok) {
            const data = await res.json()
            this.allsongs = data
          }
        } catch (error) {
          console.error('Error fetching songs:', error)
        }
      }
    },
    mounted() {
      this.fetchSongs(); // Fetch songs when the component is created
    }
  }