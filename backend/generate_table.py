from config import database_connection

def create_users_table():
    db = database_connection()
    cursor = db.cursor()

    sql = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """

    cursor.execute(sql)
    db.commit()
    cursor.close()
    db.close()
    


def create_predict_result_table():
    db = database_connection()
    cursor = db.cursor()

    sql = """
    CREATE TABLE IF NOT EXISTS predict_result (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        acne_count INT NOT NULL,
        severity VARCHAR(50) NOT NULL,
        skin_type VARCHAR(50),
        skin_confidence FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    );
    """

    cursor.execute(sql)
    db.commit()
    cursor.close()
    db.close()
