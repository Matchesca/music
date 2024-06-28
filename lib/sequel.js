const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/users.sqlite'
});

try {
    sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const User = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
      type: DataTypes.STRING,
      allowNull: true
  }
});

const Songs = sequelize.define('songs', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    song_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'email'
        }
    },
    
})

const likedSongs = sequelize.define('liked_songs', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: 'email'
    }
  },

  song_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Songs,
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
})


const Playlist = sequelize.define('playlist', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

const PlaylistSongs = sequelize.define('playlist_songs', {
  playlist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Playlist,
      key: 'id',
      onDelete: 'CASCADE'
    }
  },
  song_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Songs,
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
});

// Method to add song to the playlist 
Playlist.prototype.addSong = async function(songId) {
  const [playlistSong, created] = await PlaylistSongs.findOrCreate({
    where: {
      playlist_id: this.id,
      song_id: songId
    }
  });

  return { playlistSong, created };
};

// Method to remove song from the playlist
Playlist.prototype.removeSong = async function(songId) {
  const result = await PlaylistSongs.destroy({
    where: {
      playlist_id: this.id,
      song_id: songId
    }
  });

  return result;
};

// Define associations
User.hasMany(Playlist, { foreignKey: 'user_id' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

Playlist.belongsToMany(Songs, { through: PlaylistSongs, foreignKey: 'playlist_id' });
Songs.belongsToMany(Playlist, { through: PlaylistSongs, foreignKey: 'song_id' });

User.hasMany(Songs, { foreignKey: 'user_id' });
Songs.belongsTo(User, { foreignKey: 'user_id' });

User.belongsToMany(Songs, { through: likedSongs, foreignKey: 'user_id' });
Songs.belongsToMany(User, { through: likedSongs, foreignKey: 'song_id' });

module.exports = { sequelize, User, Songs, likedSongs, Playlist };
