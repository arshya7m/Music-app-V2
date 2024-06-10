export default {
    template:`
    <div>
    <h1 class="text-center text-success">Welcome to Music App!</h1>
    <div v-for="album in albums" :key="album.id" class="card mb-2 col-md-8 offset-md-2">
      <div class="card-header">
        <h2>{{ album.name }}</h2>
      </div>
      <div class="card-body">
        <p>Genre: {{ album.genre }}</p>
        <p>Artist: {{ album.artist }}</p>
        <button @click="flagAlbum(album.id)" class="btn btn-sm btn-warning ">Flag Album</button>
        <table class="table table-info mt-2">
            <thead>
                <tr>
                <th>Song Title</th>
                <th>Rating</th>
                <th>Duration(in sec)</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="song in album.songs" :key="song.id">
                <td>{{ song.title }}</td>
                <td>{{ song.rating }}</td>
                <td>{{ song.duration }}</td>
                <td>
                <button @click="viewSong(song.id)" class="btn btn-sm btn-primary">Read Lyrics</button>
                <button @click="flagSong(song.id)" class="btn btn-sm btn-warning">Flag Song</button>
                </td>
                </tr>
            </tbody>
            </table> 
      </div>
    </div>
  </div>
    
  
    
    `,
    data() {
      return {
        albums: [],
        token: localStorage.getItem('auth-token')
      };
    },
    methods: {
      async flagAlbum(albumId) {
        try {
          const res = await fetch(`/flag/album/${albumId}`, {
            headers: {
              'Authentication-Token': this.token
            }
          });
          const data = await res.json()
          if (res.ok) {
            alert(data.message)
          } 
          else {
            alert(data.message)
          }
        } catch (error) {
          console.error('Error flagging album:', error)
        }
      },
      async viewSong(songId) {
        this.$router.push({ name: 'ViewSong', params: { songId } })
      },


      async flagSong(songId) {
        try {
          const res = await fetch(`/flag/song/${songId}`, {
            headers: {
              'Authentication-Token': this.token
            }
          })
          const data = await res.json()
          if (res.ok) {
            alert(data.message)
          } 
          else {
            alert(data.message)
          }
        } catch (error) {
          console.error('Error flagging song:', error)
        }
      },
      async fetchAlbums() {
        try {
          const res = await fetch('/api/albums', {
            headers: {
              'Authentication-Token': this.token
            }
          })
          const data = await res.json()
          if (res.ok) {
            this.albums = data
          } 
          else {
            alert(data.message)
          }
        } catch (error) {
          console.error('Error fetching albums:', error)
        }
      }
    },
    mounted() {
      this.fetchAlbums()
    }
  }