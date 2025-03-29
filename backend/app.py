from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import psycopg2


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)  

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:kavin17@localhost/social_media_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_db_connection():
    return psycopg2.connect(
        database='social_media_db',
        user='postgres',
        password='kavin17',
        host='localhost',
        port='5432'
    )
conn = psycopg2.connect(
    dbname="social_media_db",
    user="postgres",
    password="kavin17",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)

# Create Tables
with app.app_context():
    db.create_all()

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password=hashed_password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except:
        return jsonify({'error': 'Username already exists'}), 400

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

#getting post
@app.route('/posts', methods=['GET'])
def get_posts():
    cur.execute("SELECT posts.id, posts.image_url, posts.likes, users.username FROM posts JOIN users ON posts.user_id = users.id")
    posts = cur.fetchall()

    

    posts_list = [
        {
            "id": post[0],
            "image_url": post[1],
            "likes": post[2],
            "username": post[3]
        } 
        for post in posts
    ]
    return jsonify(posts_list)


# Like a Post
@app.route('/like/<int:post_id>', methods=['POST'])
def like_post(post_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE posts SET likes = likes + 1 WHERE id = %s RETURNING likes ", (post_id,))
        new_likes = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Post liked!", "likes": new_likes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#upload a post
@app.route("/upload", methods=["POST"])
def upload_post():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    user_id = request.form.get('user_id')  

    if not user_id:
        return jsonify({'error': 'Missing user ID'}), 400

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save file to UPLOAD_FOLDER
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO post (user_id, image_url, likes) VALUES (%s, %s, %s) RETURNING id",
            (user_id, file.filename, 0)
        )
        conn.commit()
        cursor.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'File uploaded successfully'}), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("uploads", filename)

#post display
@app.route('/posts', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    return jsonify([{"id": post.id, "user_id": post.user_id, "username": post.username, "image_url": post.image_url} for post in posts])

#uploaded post  displayed in profile
@app.route('/user_posts/<int:user_id>', methods=['GET'])
def get_user_posts(user_id):
    try:
        conn = psycopg2.connect("dbname=social_media_db user=postgres password=kavin17")
        cur = conn.cursor()

      
        cur.execute("""
            SELECT posts.id, posts.image_url, posts.likes 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE posts.user_id = %s
        """, (user_id,))

        posts = cur.fetchall()
        cur.close()
        conn.close()

        post_list = []
        for post in posts:
            post_list.append({
                'id': post[1],
                #'username': post[1],  
                'image_url': post[1],
                'likes': post[2]
            })

        return jsonify(post_list), 200

    except Exception as e:
        print(f"Error fetching user posts: {str(e)}")  
        return jsonify({"error": "Internal server error"}), 500
    
#uploaded post  display 
@app.route('/profile/<int:user_id>', methods=['GET'])
def get_profile_posts(user_id):
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, image_url, likes FROM post WHERE user_id = %s", (user_id,))
        posts = cur.fetchall()
        cur.close()

        posts_list = [{"id": post[0], "image_url": post[1], "likes": post[2]} for post in posts]
        return jsonify(posts_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    cur.close()
    conn.close()


if __name__ == '_main_':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
