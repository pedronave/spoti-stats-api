const mongoose = require('mongoose');

const { Schema } = mongoose;

const PlayHistorySchema = new Schema({
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


module.exports = mongoose.model('PlayHistory', PlayHistorySchema);
