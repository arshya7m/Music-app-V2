export default {

    template:`
    <div class="container mt-5">
    <h2 class="text-center">Search Songs</h2>
    <div class="form-group row mb-4">
        <div class="col">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Enter search keyword">
        </div>
        <div class="col">
            <select class="form-select" v-model="selectedCategory">
                <option value="song">Song Title</option>
                <option value="rating">Rating</option>
            </select>
        </div>
        <div class="col">
            <button class="btn btn-primary" @click="search">Search</button>
        </div>
    </div>


    <div v-if="!searchQuery || !selectedCategory">
        <table class="table table-striped table-dark">
            <thead>
                <tr>
                    <th>Song Title</th>
                    <th>Rating</th>
                    <th>Duration(in sec)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="song in songs" :key="song.id">
                    <td>{{ song.title }}</td>
                    <td>{{ song.rating }}</td>
                    <td>{{ song.duration }}</td>
                    <td><button @click="viewSong(song.id)" class="btn btn-sm btn-primary">Read Lyrics</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div v-else>
        <div v-if="displayData.length === 0">
            <p>No results found</p>
        </div>
        <div v-else>

            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>Song Title</th>
                        <th>Rating</th>
                        <th>Duration(in sec)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="song in displayData" :key="song.id">
                        <td>{{ song.title }}</td>
                        <td>{{ song.rating }}</td>
                        <td>{{ song.duration }}</td>
                        <td><button @click="viewSong(song.id)" class="btn btn-sm btn-primary">Read Lyrics</button></td>

                    </tr>
                </tbody>
            </table>


        </div>
    </div>
</div>
    `,
    data() {
        return {
          searchQuery: '',
          selectedCategory: '',
          songs: [], // Initially empty
          displayData: [] ,
          token: localStorage.getItem('auth-token')
        };
      },
      async mounted() {
        const res = await fetch('/api/songs', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
          console.log(data)
          this.songs = data
        } else {
          this.error = res.status
        }
      },
      methods: {
        async viewSong(songId) {
          this.$router.push({ name: 'ViewSong', params: { songId } })
        },
          search() {
            if (!this.searchQuery|| !this.selectedCategory) {
              this.displayData = this.songs

            } 
            else if (this.selectedCategory === 'song') {
              this.displayData = this.songs.filter(song =>song.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
            }

            else if (this.selectedCategory === 'rating') {
              this.displayData = this.songs.filter(song => song.rating.toString().includes(this.searchQuery.toLowerCase()))
              
            } 
          }
      }

}