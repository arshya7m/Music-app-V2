from flask_sqlalchemy import SQLAlchemy
from flask_security import  UserMixin, RoleMixin
from datetime import datetime
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(225), nullable=False)
    name = db.Column(db.String)
    last_login = db.Column(db.DateTime)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(225),unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))

    # relationships
    albums = db.relationship('Album', backref='creator', lazy=True)
    playlists = db.relationship('Playlist', backref='playlist_creator', lazy=True)


class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))




class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # relationships
    songs = db.relationship('Song', secondary='playlist_song', backref='playlistsforsong')

playlist_song = db.Table(
    'playlist_song',
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'), primary_key=True),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), primary_key=True)
)

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    lyrics = db.Column(db.Text, nullable=False)
    duration = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.now())
    rating = db.Column(db.Integer)
    is_flagged = db.Column(db.Boolean, default=False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50))
    artist = db.Column(db.String(100))
    date_created = db.Column(db.DateTime, default=datetime.now())
    is_flagged = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # relationship
    songs = db.relationship('Song', backref='album', lazy=True)
