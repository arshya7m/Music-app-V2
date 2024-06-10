export default {
    template: `<div>
    <div v-if="error"> {{error}}</div>
    
        <div class="col-md-12">
            <table class="table table-dark table-striped text-center">
                <thead>
                    <tr>
                        <th>Album Name</th>
                        <th>Genre</th>                    
                        <th>Artist</th>
                        <th>Date created</th>
                        <th>Is Flagged</th>
                        <th>Delete album</th>
                    </tr>
                </thead>
                <tbody v-for="album in allalbums">
                        <tr>
                            <td>{{ album.name }}</td>
                            <td>{{ album.genre }}</td>
                            <td>{{ album.artist }}</td>
                            <td>{{ album.date_created }}</td>
                            <td v-if="album.is_flagged" class="text-warning">TRUE </td>
                            <td v-else></td>                            
                            <td>
                            <button class="btn btn-danger"  @click="deletealbum(album.id)"> Delete </button>
                            </td>
                        </tr>
                </tbody>
            </table>



        </div>
    </div>`,
    data() {
      return {
        allalbums : [],
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
    methods: {
      async deletealbum(albumid) {
        const res = await fetch(`/api/albums/${albumid}`, {

            method: 'DELETE',
            headers: {
                'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
            this.allalbums = this.allalbums.filter(album => album.id !== albumid)
            alert(data.message)
        }
      },
    },
    async mounted() {
      const res = await fetch('/api/albums', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json().catch((e) => {})
      if (res.ok) {
        console.log(data)
        this.allalbums = data
      } else {
        this.error = res.status
      }
    },
  }