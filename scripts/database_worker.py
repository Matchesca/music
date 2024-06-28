# database.py
import os
import sqlite3

# Path to the SQLite database file
DB_PATH = '../database/songs.db'

# Check if the database file exists
if os.path.isfile(DB_PATH):
    # Connect to the existing database
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    print(f"Connected to the existing database: {DB_PATH}")
else:
    # Create a new database file
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    print(f"Created a new database: {DB_PATH}")

c = conn.cursor()

# Create the table if it doesn't exist
c.execute('''CREATE TABLE IF NOT EXISTS song
             (file_path TEXT, title TEXT, artist TEXT, album TEXT, genre TEXT, year TEXT, length INTEGER, bitrate INTEGER, channels INTEGER, sample_rate INTEGER)''')


def store_metadata(file_path, metadata):
    # Insert the metadata into the database
    c.execute(
        "INSERT INTO song VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", metadata)
    conn.commit()
    print(f"Metadata for '{file_path}' stored in the database.")

# Close the database connection when the script is terminated


def close_database():
    conn.close()
