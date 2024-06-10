from flask import current_app as app, jsonify,request,render_template
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash,generate_password_hash
from flask_restful import marshal, fields
from .models import User, db, Album, Song, Playlist, Role
from .sec import datastore
from datetime import datetime



@app.get('/')
def home(): 
    return render_template('index.html')



@app.get('/admin')
@auth_required('token')
@roles_required("admin")
def admin(): 
    return 'Welcome admin'


@app.get('/flag/song/<int:song_id>')
@auth_required("token")
@roles_required("user")
def flag_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"message": "Song not found"}), 404

    song.is_flagged = True
    db.session.commit()
    return jsonify({"message": "Song flagged"})


@app.get('/flag/album/<int:album_id>')
@auth_required("token")
@roles_required("user")
def flag_album(album_id):
    album = Album.query.get(album_id)
    if not album:
        return jsonify({"message": "Album not found"}), 404

    album.is_flagged = True
    db.session.commit()
    return jsonify({"message": "Album flagged"})


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        user.last_login = datetime.now()
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    

@app.post('/user-register')
def user_register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    username = data.get('username')
    role = data.get('role', 'user')  # Default role if not specified

    if not email or not password :
        return jsonify({"message": "email and password are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists. Please choose another one."}), 400

    hashed_password = generate_password_hash(password)
    datastore.create_user(email=email, password=hashed_password, name=name, username=username, roles=[role])
    db.session.commit()

    return jsonify({"message": "User registered successfully."}), 201

