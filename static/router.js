import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Playlists from './components/Playlists.js'
import Songs from './components/Songs.js'
import Albums from './components/Albums.js'
import AddAlbum from './components/AddAlbum.js'
import Profile from './components/Profile.js'
import AddSong from './components/AddSong.js'
import EditSong from './components/EditSong.js'
import EditAlbum from './components/EditAlbum.js'
import ViewSong from './components/ViewSong.js'
import CreatePlaylist from './components/CreatePlaylist.js'
import SearchAlbum from './components/SearchAlbum.js'
import SearchSong from './components/SearchSong.js'


const routes = [
    { path: '/', component: Home , name: 'home'},
    { path: '/login', component: Login, name:'Login'},
    { path: '/register', component: Register, name:'Register'},
    { path: '/songs', component: Songs, name: 'Songs'},
    { path: '/albums', component: Albums, name: 'Albums'},
    { path: '/add-album', component: AddAlbum, name: 'AddAlbum'},
    { path: '/profile', component: Profile, name: 'Profile'},

    {path: '/add-song/:albumId', component: AddSong, name: 'AddSong'},
    {path: '/edit-song/:songId', component: EditSong, name: 'EditSong'},
    {path: '/edit-album/:albumId', component: EditAlbum, name: 'EditAlbum'},

    {path: '/view-song/:songId', component: ViewSong, name: 'ViewSong'},

    { path: '/playlists', component: Playlists, name: 'Playlists'},
    { path: '/create-playlists', component: CreatePlaylist, name: 'CreatePlaylist'},

    { path: '/search-album' , component: SearchAlbum, name: 'SearchAlbum'},
    { path: '/search-song' , component: SearchSong, name: 'SearchSong'},


]

export default new VueRouter({
    routes,
})
