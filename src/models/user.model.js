const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: 'User name is required',
  },
  spotifyAuth: {
    accessToken: String,
    accessTokenExpiration: Date,
    refreshToken: String,
  },
}, { timestamps: true });

function isDateExpired(date) {
  return date.getTime() <= Date.now();
}

// eslint-disable-next-line func-names
UserSchema.methods.isSpotifyTokenExpired = function () {
  return isDateExpired(this.spotifyAuth.accessTokenExpiration);
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * List users in ascending order of 'username'
   */
  list({ skip = '0', limit = '0' } = {}) {
    return this.find()
      .sort({ username: 1 })
      .skip(parseInt(skip, 10))
      .limit(parseInt(limit, 10))
      .exec();
  },
};

module.exports = mongoose.model('User', UserSchema);
