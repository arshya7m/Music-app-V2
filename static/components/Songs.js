export default {
    template: `<div>
    <div v-if="error"> {{error}}</div>
    
        <div class="col-md-12">
            <table class="table table-dark table-striped text-center">
                <thead>
                    <tr>
                        <th>Song Title</th>
                        <th>Rating</th>                    
                        <th>Date created</th>
                        <th>Is Flagged</th>
                        <th>Delete song</th>
                    </tr>
                </thead>
                <tbody v-for="song in allsongs">
                        <tr>
                            <td>{{ song.title }}</td>
                            <td>{{ song.rating }}</td>
                             <td>{{ song.date_created }}</td>
                            <td v-if="song.is_flagged"class="text-warning">TRUE </td>
                            <td v-else></td>
                            <td>
                            <button class="btn btn-danger"  @click="deletesong(song.id)"> Delete </button>
                            </td>
                        </tr>
                </tbody>
            </table>



        </div>
    </div>`,
    data() {
      return {
        allsongs : [],
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
    methods: {
      async deletesong(songid) {
        const res = await fetch(`/api/songs/${songid}`, {

            method: 'DELETE',
            headers: {
                'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
            this.allsongs = this.allsongs.filter(song => song.id !== songid)
            alert(data.message)
        }
      },
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
        this.allsongs = data
      } else {
        this.error = res.status
      }
    },
  }