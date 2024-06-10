from flask_restful import Resource, Api, reqparse, marshal, fields
from werkzeug.security import check_password_hash, generate_password_hash
from flask_security import auth_required, roles_required, current_user,roles_accepted
from flask import jsonify, request
from .models import db,User,Album,Song,Playlist,Role
from sqlalchemy import func
from .instances import cache


api = Api(prefix='/api')


album_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'artist': fields.String,
    'date_created': fields.DateTime,
    'is_flagged': fields.Boolean,
    'user_id': fields.Integer
}

song_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'lyrics': fields.String,
    'duration': fields.Integer,
    'date_created': fields.DateTime,
    'rating': fields.Integer,
    'is_flagged': fields.Boolean,
    'album_id': fields.Integer
}
playlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.Integer
}

# APIs for Album
class AlbumResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True)
        self.parser.add_argument('genre', type=str)
        self.parser.add_argument('artist', type=str)

    @auth_required("token")
    @cache.cached(timeout=10)
    def get(self):
        if 'creator' in current_user.roles:
            albums = Album.query.filter_by(user_id=current_user.id).all()
        else:
            albums = Album.query.all()

        if albums:
            result = []
            for album in albums:
                album_data = marshal(album, album_fields)
                album_data['songs'] = [marshal(song, song_fields) for song in album.songs]
                result.append(album_data)
            return result, 200
        return {"message": "No albums found"}, 404


    @auth_required("token")
    @roles_required('creator')
    def post(self):
        args = self.parser.parse_args()
        if not all(args.values()):
            return {"message": "All fields are required"}, 400

        new_album = Album(
            name=args['name'],
            genre=args['genre'],
            artist=args['artist'],
            user_id=current_user.id
        )
        db.session.add(new_album)
        db.session.commit()
        return {"message": "Album created"}, 201

class Alter_album(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True)
        self.parser.add_argument('genre', type=str)
        self.parser.add_argument('artist', type=str)

    @auth_required("token")
    def get(self, album_id):
        album = Album.query.get(album_id)
        if album:
            # Check if the current user is the creator of the song
            if current_user.has_role('creator') and album.creator.id != current_user.id:
                return {"message": "Unauthorized to access this album"}, 401
            return marshal(album, album_fields), 200
        return {"message": "Album not found"}, 404


    @auth_required("token")
    @roles_accepted('creator', 'admin')
    def delete(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return {"message": "Album not found"}, 404

        if current_user.has_role('admin') or (album.user_id == current_user.id):
            for song in album.songs:
                db.session.delete(song)
                db.session.commit()
            db.session.delete(album)
            db.session.commit()
            return {"message": "Album and associated songs deleted successfully"}, 200

        return {"message": "Unauthorized to delete this album"}, 401
        

    @auth_required("token")
    @roles_required('creator')
    def put(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return {"message": "Album not found"}, 404

        # Check if the current user is the creator of the album
        if album.user_id != current_user.id:
            return {"message": "Unauthorized to update this album"}, 401

        args = self.parser.parse_args()
        if not all(args.values()):
            return {"message": "All fields are required"}, 400

        album.name = args['name']
        album.genre = args['genre']
        album.artist = args['artist']
        db.session.commit()
        return {"message": "Album updated successfully"}, 200






# APIs for Song
class SongResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True)
        self.parser.add_argument('lyrics', type=str, required=True)
        self.parser.add_argument('duration', type=int)
        self.parser.add_argument('rating', type=int)

    @auth_required("token")
    @roles_accepted('user', 'admin')
    @cache.cached(timeout=10)
    def get(self):
        songs = Song.query.all()
        if songs:
            return marshal(songs, song_fields), 200
        return {"message": "No songs found"}, 404
    



class Create_song(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True)
        self.parser.add_argument('lyrics', type=str, required=True)
        self.parser.add_argument('duration', type=int)
        self.parser.add_argument('rating', type=int)

    @auth_required("token")
    @roles_required('creator')
    def post(self, album_id):
        args = self.parser.parse_args()

        # Check if all required fields are present
        if not all(args.values()):
            return {"message": "All fields are required"}, 400

        # Check if the album exists and belongs to the current user (creator)
        album = Album.query.filter_by(id=album_id, user_id=current_user.id).first()
        if not album:
            return {"message": "Album not found or unauthorized to add song"}, 404

        # Verify that the current user is the creator of the album
        if not current_user.has_role('creator') or album.user_id != current_user.id:
            return {"message": "Unauthorized to add song to this album"}, 401

        # Create a new song associated with the specified album
        song = Song(
            title=args['title'],
            lyrics=args['lyrics'],
            duration=args['duration'],
            rating=args['rating'],
            album_id=album.id  # Associate the song with the specified album
        )

        db.session.add(song)
        db.session.commit()
        return {"message": "Song created successfully"}, 201
    

class SingleSongResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str)
        self.parser.add_argument('lyrics', type=str)
        self.parser.add_argument('duration', type=int)
        self.parser.add_argument('rating', type=int)

    @auth_required("token")
    def get(self, song_id):
        song = Song.query.get(song_id)
        if song:
            # Check if the current user is the creator of the song
            if current_user.has_role('creator') and song.album.creator.id != current_user.id:
                return {"message": "Unauthorized to access this song"}, 401
            return marshal(song, song_fields), 200
        return {"message": "Song not found"}, 404

    @auth_required("token")
    @roles_accepted('creator', 'admin')
    def delete(self, song_id):
        song = Song.query.get(song_id)
        if not song:
            return {"message": "Song not found"}, 404

        # Check if the current user is the creator of the song or admin
        if current_user.has_role('admin') or (song.album.creator.id == current_user.id):
            db.session.delete(song)
            db.session.commit()
            return {"message": "Song deleted successfully"}, 200

        return {"message": "Unauthorized to delete this song"}, 401

    @auth_required("token")
    @roles_required('creator')
    def put(self, song_id):
        song = Song.query.get(song_id)
        if not song:
            return {"message": "Song not found"}, 404

        # Check if the current user is the creator of the song's album
        if song.album.creator.id == current_user.id:
            args = self.parser.parse_args()
            if not all(args.values()):
                return {"message": "All fields are required"}, 400

            song.title = args['title']
            song.lyrics = args['lyrics']
            song.duration = args['duration']
            song.rating = args['rating']
            db.session.commit()
            return {"message": "Song updated successfully"}, 200

        return {"message": "Unauthorized to edit this song"}, 401











class UserProfile(Resource):
    @auth_required('token')
    def get(self):
        # Fetch user details from the database based on the logged-in user
        user = User.query.get(current_user.id)
        if not user:
            return {"message": "User not found"}, 404

        # Serialize user data or convert to JSON as needed
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name,
            
        }
        return user_data, 200

    @auth_required('token')
    def put(self):
        # Fetch the logged-in user from the database
        user = User.query.get(current_user.id)
        if not user:
            return {"message": "User not found"}, 404

        if current_user.id != user.id:
            return {"message": "Unauthorized to update this profile"}, 401
        
        updated_data = request.get_json()

        if 'email' in updated_data and not updated_data['email']:
            return {"message": "Email cannot be empty"}, 400

        

        # Check if current password and new password are provided
        current_password = updated_data.get('current_password')
        new_password = updated_data.get('new_password')


        if current_password and new_password:
            if not check_password_hash(user.password, current_password):
                return {"message": "Current password is incorrect"}, 400

            user.password = generate_password_hash(new_password)

       
        user.email = updated_data['email']   

        if 'username' in updated_data:
            user.username = updated_data['username']

        if 'name' in updated_data:
            user.name = updated_data['name']

        db.session.commit()
        return {"message": "User data updated successfully"}, 200
    
class AdminStats(Resource):
    @auth_required("token")
    @roles_required('admin')
    def get(self):
        if current_user.has_role('admin'):
            # Get the count of total users excluding those with the 'admin' role
            total_users = User.query.filter(User.roles.any(name='user') ).count()

            # Other statistics calculations...
            total_songs = Song.query.count()
            total_albums = Album.query.count()
            total_genres = Album.query.distinct(Album.genre).count()
            if total_songs > 0:
                avg_rating = round(db.session.query(func.avg(Song.rating)).scalar(), 2)
            else:
                avg_rating = 0

            # Get the count of users having the 'creator' role
            total_creators = User.query.filter(User.roles.any(name='creator')).count()

            return {
                "total_users": total_users,
                "total_creators": total_creators,
                "total_songs": total_songs,
                "total_albums": total_albums,
                "total_genres": total_genres,
                "average_rating": avg_rating
            }, 200
        return {"message": "Unauthorized to get admin stats"}, 401


class SongRating(Resource):
    @auth_required("token")
    @roles_required('user')
    def put(self, song_id):
        data = request.get_json()    
        song = Song.query.get(song_id) 
        rating = int(data.get('rating'))

        if not song:
            return {'message': 'Song not found'}, 404

        if not (1 <= rating <= 10):
            return {'message': 'Rating should be between 1 and 10'}, 400

        if not song.rating:
            song.rating = rating
            db.session.commit()
        else:
            current_rating = song.rating
            updated_rating = (current_rating + rating) / 2
            song.rating = int(updated_rating)
            db.session.commit()

        return {'message': 'Thanks for rating'}, 200
    

class CreatePlaylist(Resource):
    @auth_required("token")
    @roles_required('user')
    def get(self):
        playlists = Playlist.query.filter_by(user_id=current_user.id).all()
        if playlists:
            result = []
            for playlist in playlists:
                playlist_data = marshal(playlist, playlist_fields)
                playlist_data['songs'] = [marshal(song, song_fields) for song in playlist.songs]
                result.append(playlist_data)
            return result, 200
        return {"message": "No playlists found"}, 404
    
    @auth_required("token")
    @roles_required('user')
    def post(self):
        data = request.get_json()
        playlist_name = data.get('name')
        songs = data.get('songs')  #list of song IDs

        if not playlist_name or not songs:
            return {'message': 'Name and songs are required'}, 400

        new_playlist = Playlist(name=playlist_name, user_id=current_user.id )
        
        for song_id in songs:
            song = Song.query.get(song_id)
            if song:
                new_playlist.songs.append(song)

        db.session.add(new_playlist)
        db.session.commit()

        return {'message': 'Playlist created successfully'}, 201
    
class DeletePlaylist(Resource):
    @auth_required("token")
    @roles_accepted('user')
    def delete(self, playlist_id):
        playlist = Playlist.query.get(playlist_id)
        if not playlist:
            return {"message": "playlist not found"}, 404

        if (playlist.user_id == current_user.id):
            db.session.delete(playlist)
            db.session.commit()
            return {"message": "Playlist deleted"}, 200

        return {"message": "Unauthorized to delete this playlist"}, 401


api.add_resource(CreatePlaylist, '/playlists')
api.add_resource(DeletePlaylist, '/playlist/<int:playlist_id>')

api.add_resource(SongRating, '/song/rate/<int:song_id>')

api.add_resource(AdminStats, '/admin/stats')

api.add_resource(UserProfile, '/user-profile')

api.add_resource(AlbumResource, '/albums')
api.add_resource(Alter_album, '/albums/<int:album_id>')

api.add_resource(SongResource, '/songs')
api.add_resource(Create_song, '/songs/<int:album_id>')
api.add_resource(SingleSongResource, '/songs/<int:song_id>')


# api.add_resource(PlaylistResource, '/playlists')
# api.add_resource(SinglePlaylistResource, '/playlists/<int:playlist_id>')
# api.add_resource(FlagSongResource, '/songs/<int:song_id>/flag')
# api.add_resource(AddSongToPlaylist, '/playlists/<int:playlist_id>/add-song')
