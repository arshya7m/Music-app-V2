export default {
    template:`
    <div class="container mt-4">
    <h1>Welcome, Creator!</h1>
    <hr>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-for="album in albums" :key="album.id" class="mt-4">
      <div class="card">
        <div class="card-header">
          <h3>{{ album.name }}</h3>
          <div>
            <button @click="editAlbum(album.id)" class="btn btn-primary">Edit Album</button>
            <button @click="deleteAlbum(album.id)" class="btn btn-danger">Delete Album</button>
            <button @click="addSong(album.id)" class="btn btn-success">Add Song</button>
          </div>
        </div>
        <div class="card-body">
          <p><h5>Genre: {{ album.genre }}</h5></p>
          <p><h5>Artist: {{ album.artist }}</h5></p>
          <h3>Songs:</h3>
          <table class="table table-striped table-secondary">
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Duration(in sec)</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in album.songs" :key="song.id">
                <td>{{ song.title }}</td>
                <td>{{ song.rating }}</td>
                <td>{{ song.duration }}</td>
                <td>{{ song.date_created }}</td>
                <td>
                  <button @click="editSong(song.id)" class="btn btn-primary">Edit</button>
                  <button @click="deleteSong(song.id)" class="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
    
    
    `,

    data() {

        return {
            albums: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async fetchAlbums() {
            try {
            const response = await fetch('/api/albums', {
                headers: {
                'Authentication-Token': this.token
                }
            })
            if (response.ok) {
                const data = await response.json()
                this.albums = data
            } else {
                console.error('Failed to fetch albums:', response.status)
            }
            } catch (error) {
            console.error('Error fetching albums:', error)
            }
        },

        async addSong(albumId) {
            this.$router.push({ name: 'AddSong', params: { albumId } })
        },


        async editSong(songId) {
            this.$router.push({ name: 'EditSong', params: { songId } })
        },


        async deleteSong(songId) {
            try {
            const response = await fetch(`/api/songs/${songId}`, {
                method: 'DELETE',
                headers: {
                'Authentication-Token': this.token
                }
            })
            if (response.ok) {
                this.albums.forEach(album => {
                album.songs = album.songs.filter(song => song.id !== songId)
                })
                console.log('Song deleted successfully')
            } else {
                console.error('Failed to delete song:', response.status)
            }
            } catch (error) {
            console.error('Error deleting song:', error)
            }
        },

        async editAlbum(albumId) {
            this.$router.push({ name: 'EditAlbum', params: { albumId } })
        },


        async deleteAlbum(albumId) {
            try {
                const res = await fetch(`/api/albums/${albumId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authentication-Token': this.token
                  }
                })
                const data = await res.json()       
                if (res.ok) {
                    this.albums = this.albums.filter(album => album.id !== albumId)
                    alert(data.message)
                } 
                else {
                  throw new Error(data.message || 'Failed to delete album');
                }
              } catch (error) {
                console.error('Error deleting album:', error.message)
                alert(error.message || 'Failed to delete album');
            }
        }
        
    },

    async mounted() {
        await this.fetchAlbums(); // Fetch albums data when the component is mounted
    }
}