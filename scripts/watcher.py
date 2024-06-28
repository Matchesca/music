import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

import os
import stat

# Mutagen imports
from mutagen import File
from mutagen.mp3 import MP3
from mutagen.flac import FLAC
from mutagen.oggvorbis import OggVorbis

from database_worker import store_metadata, close_database

DIR = "Music/"
DB_PATH = 'songs.db'
MUTAGEN_MODULES = {
    '.mp3': MP3,
    '.flac': FLAC
}


def get_human_readable_size(size, decimal_places=2):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB', 'PB']:
        if size < 1024.0 or unit == 'PB':
            break
        size /= 1024.0
    return f"{size:.{decimal_places}f} {unit}"


def print_metadata(file_path):
    file_ext = os.path.splitext(file_path)[1].lower()

    # Check if the file extension is supported
    if file_ext in MUTAGEN_MODULES:
        try:
            # Load the audio file using the corresponding mutagen module
            audio = MUTAGEN_MODULES[file_ext](file_path)

            # Get metadata
            print(audio.pprint())
            title = audio.get('title', ['Unknown'])[0]
            artist = audio.get('artist', ['Unknown'])[0]
            album = audio.get('album', ['Unknown'])[0]
            genre = audio.get('genre', ['Unknown'])[0]
            year = audio.get('date', ['Unknown'])[0]
            length = int(audio.info.length)
            bitrate = int(audio.info.bitrate / 1000)
            channels = audio.info.channels if file_ext == '.flac' else None
            sample_rate = audio.info.sample_rate if file_ext == '.flac' else None
            metadata = (file_path, title, artist, album, genre,
                        year, length, bitrate, channels, sample_rate)

            # Store metadata in the database
            store_metadata(file_path, metadata)
            # Additional metadata specific to the file format
            if file_ext == '.flac':
                print("Channels:", audio.info.channels)
                print("Sample Rate:", audio.info.sample_rate)
        except Exception as e:
            print(f"Error reading file '{file_path}': {e}")
    else:
        print(f"Unsupported file extension '{file_ext}'")
    print(" ")
    print(" ")
    print(" ")


class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        # This function is called whenever a new file is created

        print(f"File size: ", get_human_readable_size(
            os.stat(event.src_path).st_size))

        print_metadata(event.src_path)


if __name__ == "__main__":
    # Specify the directory to watch
    dir_to_watch = DIR

    # Create an event handler instance
    event_handler = NewFileHandler()

    # Create an observer instance
    observer = Observer()
    observer.schedule(event_handler, dir_to_watch, recursive=True)

    # Start the observer
    observer.start()

    try:
        while True:
            # Wait indefinitely for events
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        close_database()
    observer.join()
