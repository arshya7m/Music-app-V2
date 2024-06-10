export default {
    template: `<div>
    
    <h1 class="text-center mt-3">App Performance</h1>
    <hr>
    
    <div class="row mb-5" >
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title">Normal Users</h4>
                <h3 class="card-body"> {{ stats.total_users }}</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title ">Total Creators</h4>
                <h3 class="card-body"> {{ stats.total_creators }}</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title">Total Albums</h4>
                <h3 class="card-body"> {{ stats.total_albums }}</h3>
            </div>
        </div>
    </div>
    <div class="row" >
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title">Total songs</h4>
                <h3 class="card-body"> {{ stats.total_songs }}</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title ">Average Rating</h4>
                <h3 class="card-body"> {{ stats.average_rating }}</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-center">
                <h4 class="card-title">Genre</h4>
                <h3 class="card-body"> {{ stats.total_genres }}</h3>
            </div>
        </div>
    </div>
    
    
    </div>`,
    data() {
      return {
        stats: {
            total_users: null,
            total_creators: null,
            total_songs: null,
            total_albums: null,
            total_genres: null,
            average_rating: null
        },
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
   
    async mounted() {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json().catch((e) => {})
      if (res.ok) {
        // console.log(data)
        this.stats = data
      } else {
        this.error = data.message
      }
    },
  }