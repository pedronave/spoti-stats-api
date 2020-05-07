import * as mongoose from 'mongoose';


export class User extends mongoose.Document {
  _id: string;

  displayName: string;

  spotifyAuth: {
    accessToken: string;
    accessTokenExpiration: Date;
    refreshToken: string;
  }

  isSpotifyTokenExpired(): boolean {
    return this.spotifyAuth.accessTokenExpiration.getTime() <= Date.now();
  }
}

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


export default mongoose.model<User>('User', UserSchema);
