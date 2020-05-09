import * as mongoose from 'mongoose';

export interface PlayHistory {
  userId: string;
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
  playedAt: Date;
}

export interface PlayHistoryDocument extends PlayHistory, mongoose.Document {}

const PlayHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    track: {
      id: String,
      name: String,
      album: {
        id: String,
        name: String,
      },
      artists: [
        {
          id: String,
          name: String,
        },
      ],
    },
    playedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<PlayHistoryDocument>('Plays', PlayHistorySchema);
