
export default {

    template:`
    
    <div>

    <h2 class="text-center">Search Albums</h2>
    <div class="form-group row mb-3">
      <div class="col">
      <input type="text" class="form-control" v-model="searchQuery" placeholder="Enter search keyword">
      </div>
      <div class="col">
      <select class="form-select" v-model="selectedCategory">
        <option value="album">Album Name</option>
        <option value="genre">Genre</option>
        <option value="artist">Artist</option>
      </select>
      </div>
      <div class="col">
      <button class="btn btn-primary" @click="search">Search</button>
      </div>
    </div>

    <div>
      <!-- Display albums and songs based on search -->
      <div v-if="!searchQuery || !selectedCategory">
        <!-- Display all albums and their songs when fields are cleared -->
        <div v-for="album in albums" :key="album.id">
          <h3>{{ album.name }}</h3>
          <p>Genre: {{ album.genre }}</p>
          <p>Artist: {{ album.artist }}</p>
          <table class="table table-dark">
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
                <td><button @click="viewSong(song.id)" class="btn btn-primary">Read Lyrics</button></td>
                </tr>
            </tbody>
            </table>
        </div>
      </div>
      
      <div v-else>
        <!-- Filtered display based on search -->
        <div v-if="displayData.length === 0">
          <p>No results found</p>
        </div>
        <div v-else>
          <div v-for="item in displayData" :key="item.id">
            <h3>{{ item.name }}</h3>
            <p>Genre: {{ item.genre }}</p>
            <p>Artist: {{ item.artist }}</p>
            <table class="table table-dark">
            <thead>
                <tr>
                <th>Song Title</th>
                <th>Rating</th>
                <th>Duration(in sec)</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="song in item.songs" :key="song.id">
                <td>{{ song.title }}</td>
                <td>{{ song.rating }}</td>
                <td>{{ song.duration }}</td>
                <td><button @click="viewSong(song.id)" class="btn btn-primary">Read Lyrics</button></td>
              
                </tr>
            </tbody>
            </table>
              
          </div>
        </div>
      </div>
    </div>

  </div>
    `,
    

    data() {
        return {
          searchQuery: '',
          selectedCategory: '',
          albums: [], // Initially empty
          displayData: [] ,
          token: localStorage.getItem('auth-token')
        };
      },
      mounted() {
        this.fetchAlbums()
      },
      methods: {
        async viewSong(songId) {
          this.$router.push({ name: 'ViewSong', params: { songId } })
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
          },
          search() {
            if (!this.searchQuery|| !this.selectedCategory) {
              // When fields are cleared, display all albums and songs
              this.displayData = this.albums;
            } else if (this.selectedCategory === 'album') {
              // Filter albums by album name
              this.displayData = this.albums.filter(album =>
                album.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              )
            } else if (this.selectedCategory === 'artist') {
              // Filter albums by artist name
              this.displayData = this.albums.filter(album =>
                album.artist.toLowerCase().includes(this.searchQuery.toLowerCase())
              );
            } else if (this.selectedCategory === 'genre') {
              // Filter albums by genre
              this.displayData = this.albums.filter(album =>
                album.genre.toLowerCase().includes(this.searchQuery.toLowerCase())
              )
            }
          }
      }

}