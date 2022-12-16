const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  //skip
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Course",
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;