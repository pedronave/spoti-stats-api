import * as mongoose from 'mongoose';

export interface PlayHistory extends mongoose.Document {
  userId: string;
  plays: Play[];
}

export interface Play {
  track: {
    id: string;
    name: string;
    album: {
      id: string;
      name: string;
    };
    artists: {
      id: string;
      name: string;
    }[];
  };
  played_at: Date;
}

const PlayHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  plays: [{
    track: {
      id: String,
      name: String,
      album: {
        id: String,
        name: String,
      },
      artists: [{
        id: String,
        name: String,
      }],
    },
    played_at: Date,
  }],
}, { timestamps: true });


export default mongoose.model<PlayHistory>('PlayHistory', PlayHistorySchema);