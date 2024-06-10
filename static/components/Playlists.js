export default {
    template: `
    <div class="container mt-5">
    <h2>My Playlists</h2>
    <router-link :to="{ name: 'CreatePlaylist' }" class="btn btn-primary mb-3">Create Playlist</router-link>
  
    <div v-for="playlist in playlists" :key="playlist.id" class="card mb-3 col-md-6 offset-md-3 bg-dark text-white">
      <div class="card-header ">
        <h3>{{ playlist.name }}</h3>
        <button class="btn btn-danger" @click="deleteplaylist(playlist.id)">Delete</button>
      </div>
      <ul class="list-group">
        <li v-for="song in playlist.songs" :key="song.id" class="list-group-item d-flex justify-content-between align-items-center">{{ song.title }}
        <button @click="viewSong(song.id)" class="btn btn-primary">Read Lyrics</button>
        </li>
      </ul>
    </div>
  </div>
  
    `,
    data() {
      return {
        playlists: [],
        token:localStorage.getItem('auth-token'),
      };
    },
    methods: {
        async viewSong(songId) {
            this.$router.push({ name: 'ViewSong', params: { songId } })
          },
        async deleteplaylist(playlistid) {
        const res = await fetch(`/api/playlist/${playlistid}`, {

            method: 'DELETE',
            headers: {
                'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
            this.playlists = this.playlists.filter(playlist => playlist.id !== playlistid)
            alert(data.message)
        }
      },
      async fetchUserPlaylists() {
        try {
          const res = await fetch('/api/playlists', {
            headers: {
              'Authentication-Token': this.token
            }
          });
  
          if (res.ok) {
            const data = await res.json();
            this.playlists = data;
          }
        } catch (error) {
          console.error('Error fetching user playlists:', error);
        }
      }
    },
    mounted() {
      this.fetchUserPlaylists(); // Fetch user's playlists when the component is created
    }
  };
  