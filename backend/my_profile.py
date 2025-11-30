# profile.py
from flask import request, jsonify, session
from werkzeug.security import generate_password_hash

def get_my_profile(db):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({
            "success": False,
            "message": "Not authenticated."
        }), 401

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, email, phone FROM users WHERE id = %s",
        (user_id,)
    )
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


def update_my_profile(db):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({
            "success": False,
            "message": "Not authenticated."
        }), 401

    data = request.get_json() or {}
    name = data.get("name")
    phone = data.get("phone")
    password = data.get("password") or ""

    # Validasi basic di backend (jaga-jaga)
    if not name or not phone:
        return jsonify({
            "success": False,
            "message": "Name and phone are required."
        }), 400

    try:
        cursor = db.cursor(dictionary=True)

        fields = ["name = %s", "phone = %s"]
        values = [name, phone]

        # Password optional: kalau diisi, update + hash
        if password.strip():
            hashed = generate_password_hash(password)
            fields.append("password = %s")
            values.append(hashed)

        values.append(user_id)

        sql = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
        cursor.execute(sql, tuple(values))
        db.commit()

        # update juga session biar navbar langsung ikut berubah
        session["user_name"] = name

        # ambil kembali data terbaru
        cursor.execute(
            "SELECT id, name, email, phone FROM users WHERE id = %s",
            (user_id,)
        )
        user = cursor.fetchone()

        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "data": user
        }), 200

    except Exception as e:
        db.rollback()
        print("Error update_my_profile:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
