# auth.py
from flask import request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

# REGISTER
def register(db):
    try:
        data = request.get_json() or {}
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")

        # Validasi sederhana
        if not name or not email or not password or not phone:
            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400

        cursor = db.cursor(dictionary=True)

        # Cek email sudah terdaftar
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing = cursor.fetchone()
        if existing:
            return jsonify({
                "success": False,
                "message": "Email already registered."
            }), 409

        # Hash password
        hashed_password = generate_password_hash(password)

        # Simpan user baru
        sql = """
            INSERT INTO users (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (name, email, hashed_password, phone))
        db.commit()

        user_id = cursor.lastrowid

        # Simpan ke session
        session["user_id"] = user_id
        session["user_name"] = name
        session["user_email"] = email

        return jsonify({
            "success": True,
            "message": "Register success.",
            "data": {
                "id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
            }
        }), 201

    except Exception as e:
        db.rollback()
        print("Error register:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# LOGIN
def login(db):
    try:
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, name, email, password, phone
            FROM users
            WHERE email = %s
            LIMIT 1
        """, (email,))
        user = cursor.fetchone()

        # email tidak ditemukan
        if not user:
            return jsonify({
                "success": False,
                "message": "Email or password is incorrect."
            }), 401

        # cek password
        if not check_password_hash(user["password"], password):
            return jsonify({
                "success": False,
                "message": "Email or password is incorrect."
            }), 401

        # simpan ke session
        session["user_id"] = user["id"]
        session["user_name"] = user["name"]
        session["user_email"] = user["email"]

        return jsonify({
            "success": True,
            "message": "Login success.",
            "data": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
            }
        }), 200

    except Exception as e:
        print("Error login:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# LOGOUT (opsional)
def logout():
    session.clear()
    return jsonify({
        "success": True,
        "message": "Logged out."
    }), 200


# CURRENT USER (opsional)
def current_user(db):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({
            "success": False,
            "message": "Not authenticated."
        }), 401

    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, email, phone 
        FROM users 
        WHERE id = %s
    """, (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "data": user
    }), 200
