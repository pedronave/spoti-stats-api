import * as mongoose from 'mongoose';

export class User extends mongoose.Document {
  _id: string;
  displayName: string;
  spotifyAuth: {
    accessToken: string;
    accessTokenExpiration: Date;
    refreshToken: string;
  }

  isSpotifyTokenExpired() {
    return isDateExpired(this.spotifyAuth.accessTokenExpiration);
  };
};

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
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

export default mongoose.model<User>('User', UserSchema);
