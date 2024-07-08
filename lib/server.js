const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors"); // Import the cors package
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { User, Songs, likedSongs, Playlist ,sequelize } = require("./sequel");
sequelize.sync();
const { Op } = require('sequelize');
const { v4 } = require('uuid')
var cookieParser = require('cookie-parser');
const app = express();
const port = 4000;

const allowedOrigins = ['http://192.168.29.27:3000', 'http://localhost:3000']

// Enable CORS for all routes
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Enable sending cookies
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Set up storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/data/music");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'song', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

// To upload files
app.post("/upload", upload, async (req, res) => {
  if (!req.files || !req.files.song || !req.files.image) {
    return res.status(400).send("No files uploaded.");
  }

  const songFile = req.files.song[0];
  const imageFile = req.files.image[0];
  const { email } = req.body;

  try {
    const { parseFile } = await import("music-metadata");
    const metadata = await parseFile(songFile.path);
    const { title, artist } = metadata.common;
    const { duration, container } = metadata.format;

    const newSong = await Songs.create({
      title: title || songFile.originalname,
      song_path: songFile.filename,
      image_path: imageFile.filename,
      author: artist || "Unknown",
      user_id: email,
      duration: duration || 0,
      container: container
    });

    res.status(200).json({ message: "Files uploaded and metadata saved.", song: newSong });
  } catch (error) {
    console.error("Error processing files", error);
    res.status(500).send("Internal Server Error");
  }
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, password, userName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, password: hashedPassword, userName });
    res.status(201).json({userName: user.userName, email: user.email});
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  const existingToken = req.cookies.token;
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("Logging in")
    const token = jwt.sign({ userId: user.email, username: user.userName }, 'your-secret-key', { expiresIn: '2h' });
    console.log(req.cookies) 
    // Set cookie with token
    res.cookie('token', token, {expires: new Date(Date.now() + 7200000), sameSite: "None", secure: true} )
    // res.cookie('token', token).send('cookie set');
    res.status(200).json({token: token, user: {email: email, userName: user.username}}).send()
    console.log("Logged in")
  } else {
    if (existingToken){
      res.status(401).json({error: "exisiting token"})
    } else {
    res.status(401).json({ error: "Invalid credentials" });
    }
  }
});

app.post("/logout", (req, res) => {
  console.log("Logging out...")
  res.clearCookie('token', {
    secure: false, // Change to true if using HTTPS
    
  });
  res.status(200).json({ message: "Logout successful" });
});


app.post("/get-song-by-userid", async (req, res) => {

  const { userId } = req.body;

  try {
    const songs = await Songs.findAll({
      where: { user_id: userId } // Filter songs by user ID
    });

    // Respond with the retrieved songs
    res.status(200).json(songs);
  } catch (error) {
    // Handle errors
    console.error("Error retrieving songs:", error);
    res.status(500).json({ error: "Failed to retrieve songs" });
  }

})

app.post("/get-all-song", async (req, res) => {

  try {
    const songs = await Songs.findAll();

    // Respond with the retrieved songs
    res.status(200).json(songs);
  } catch (error) {
    // Handle errors
    console.error("Error retrieving songs:", error);
    res.status(500).json({ error: "Failed to retrieve songs" });
  }

})

app.post("/get-song-by-id", async (req, res) => {
  const { id } = req.body;

  try {
    const song = await Songs.findOne({ where: { id: id } });
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    console.error("Error retrieving song:", error);
    res.status(500).json({ error: "Failed to retrieve song" });
  }
});

app.post("/get-liked-song-ids", async (req, res) => {
  const { userId } = req.body;

  try {
    // Find liked songs by user ID and include the associated Songs
    const likedSongsData = await likedSongs.findAll({
      where: { user_id: userId },
      attributes: ['song_id'],
    });

    if (!likedSongsData.length) {
      return res.status(404).json({ error: "No songs found" });
    }       

    // Map the liked songs to return only the song details
    const songIds = likedSongsData.map(record => record.song_id);
    res.status(200).json(songIds);
  } catch (error) {
    console.error("Error retrieving liked songs", error);
    res.status(500).json({ error: "Failed to retrieve liked songs" });
  }
});

app.post("/get-songs-by-ids", async (req, res) => {
  const { songIds } = req.body;

  try {
    const songs = await Songs.findAll({
      where: {
        id: {
          [Op.in]: songIds
        }
      }
    });

    if (!songs.length) {
      return res.status(404).json({ error: "No songs found" });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error("Error retrieving songs by IDs", error);
    res.status(500).json({ error: "Failed to retrieve songs by IDs" });
  }
});

// Get songs by title
app.post('/get-songs-by-title', async (req, res) => {
  const { songTitle } = req.body;

  try {
    let songs;
    if (!songTitle) {
      // If no title is provided, return all songs
      songs = null;
    } else {
      // If a title is provided, search for songs with titles matching the provided string
      songs = await Songs.findAll({
        where: {
          title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + songTitle.toLowerCase() + '%')
        }
      });
    }

    if (songs && !songs.length) {
      return res.status(404).json({ error: "No songs found" });
    }
    console.log(songs, songTitle)

    res.status(200).json(songs);
  } catch (error) {
    console.error("Error retrieving songs by title:", error);
    res.status(500).json({ error: "Failed to retrieve songs by title" });
  }
});


app.post("/get-if-song-liked", async (req, res) => {
  const { userId, songId } = req.body;

  console.log("Received request to check if song is liked");
  console.log("userId:", userId);
  console.log("songId:", songId);

  try {
    const song = await likedSongs.findOne({ where: { user_id: userId, song_id: songId } });
    
    if (!song) {
      console.log("Song not found for user");
      return res.status(200).json({ liked: false });
    }

    console.log("Song is liked by user");
    res.status(200).json({ liked: true });
  } catch (error) {
    console.error("Error retrieving if song is liked", error);
    res.status(500).json({ error: "Error retrieving if song is liked" });
  }
})

app.post("/like-song", async (req, res) => {

  const { userId, songId } = req.body;

  try {
    const like = await likedSongs.create({ user_id: userId, song_id: songId });

    res.status(200).json(like);
  } catch (error) {
    res.status(400).json({ error: "Already Liked" });
  }
})

app.post("/unlike-song", async (req, res) => {
  const { userId, songId } = req.body;

  try {
    const unlike = await likedSongs.destroy({where: {
      user_id: userId,
      song_id: songId
    }})

    res.status(200).json(unlike);
  } catch (error) {
    res.status(500).json({error: "Failed"})
  }
})

// Delete a song from the database and the files
app.post("/delete-song", async (req, res) => {
  try {
    const { songId } = req.body;

    // Find the song record to get the image file name
    const song = await Songs.findOne({ where: { id: songId } });

    if (!song) {
      return res.status(404).json({ message: "No song found with the matching id" });
    }

    // Delete the song record from the database
    const deleted = await Songs.destroy({ where: { id: songId } });

    if (!deleted) {
      return res.status(404).json({ message: "No song found with the matching id" });
    }

    // Delete the image file from storage
    const imagePath = path.join(__dirname, "../public/data/music/", song.image_path); // Adjust the path as per your storage location
    const songPath = path.join(__dirname, "../public/data/music/", song.song_path);
    fs.unlink(songPath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete song file" });
      } console.log(`Deleted image file: ${song.image_path}`);
    });
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({ error: "Failed to delete image file" });
      }
      console.log(`Deleted image file: ${song.image_path}`);
      res.status(200).json({ message: "Successfully deleted song and image" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete song" });
  }
});

// Playlist creation endpoint
app.post("/generate-playlist", async (req, res) => {

  try {

    const { userId } = req.body;

    const playlists = await Playlist.findAll({where: {
      user_id: userId
    }
    })

    const playlistId = v4();
    const name = "Playlist #" + (playlists.length + 1).toString()

    const playlist = await Playlist.create({id: playlistId, name, user_id: userId, is_public: false})

    if (playlist) {
      res.status(200).json({playlistId})
    } else {
      res.status(500).json({error: "Failed to create the playlist"})
    }

  } catch (error) {
    res.status(500).json({error: "Failed to create a playlist"})
  }

})

app.post("/get-playlist-by-id", async (req, res) => {

  try {

    const { playlistId } = req.body;

    const playlist = await Playlist.findOne({where: {
      id: playlistId
    }})

    if (playlist) {
      res.status(200).json({playlist})
    } else {
      res.status(500).json({error: "No playlist found"})
    }


  } catch (error) {
    res.status(500).json({error: "Failed to retrieve the name of the playlist"})
  }

})

// Add song to the playlist
app.post("/playlist-add-song", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findOne({ where: { id: playlistId } });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const response = await playlist.addSong(songId);
    if (response.created) {
      res.status(200).json({ message: "Song added to the playlist successfully" });
    } else {
      res.status(200).json({ message: "Song already in the playlist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add song to the playlist" });
  }
});

// Get all the songs of the playlist
app.post("/get-playlist-songs", async (req, res) => {
  try {
    const { playlistId } = req.body;

    // Find the playlist by ID
    const playlist = await Playlist.findOne({
      where: { id: playlistId },
      include: [
        {
          model: Songs,
          through: {
            attributes: []
          }
        }
      ]
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Extract the songs from the playlist
    const songs = playlist.songs;

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve playlist songs" });
  }
});

//Get all the playlists of the user
app.post("/get-user-playlists", async (req, res) => {

  try {
    const { userId } = req.body;
    const playlists = await Playlist.findAll({where: {
      user_id: userId
    }})
    res.status(200).json(playlists);

  } catch (error) {
    res.status(500).json({error: "Failed to retrieve playlists of the use"})
  }

})

// Remove song from the given playlist
app.post("/remove-song-from-playlist", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findOne({ where: { id: playlistId } });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const result = await playlist.removeSong(songId);

    if (result) {
      res.status(200).json({ message: "Song removed from playlist" });
    } else {
      res.status(400).json({ error: "Failed to remove song from playlist" });
    }
  } catch (error) {
    console.error("Error removing song from playlist", error);
    res.status(500).json({ error: "Failed to remove song from playlist" });
  }
});

// Delete a playlist
app.post("/delete-playlist", async (req, res) => {
  try {
    const { playlistId } = req.body;
    // Find the playlist to delete
    const playlist = await Playlist.findOne({ where: { id: playlistId } });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Delete the playlist
    await playlist.destroy();

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
});

// Rename a playlist
app.post("/rename-playlist", async (req, res) => {
  try {
    const { playlistId, newName } = req.body;

    const playlist = await Playlist.findOne({ where: { id: playlistId } });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    playlist.name = newName;
    await playlist.save();

    res.status(200).json({ message: "Playlist renamed successfully", playlist });
  } catch (error) {
    console.error("Error renaming playlist:", error);
    res.status(500).json({ error: "Failed to rename playlist" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
