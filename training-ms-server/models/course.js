const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Batch",
  },
  topics: [
    {
      topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    },
  ],
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

courseSchema.methods.addToCourse = async function (topicId) {
  try {
    this.topics.push({
      topic: topicId,
    });
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

courseSchema.methods.removeFromCourse = async function (topicId) {
  try {
    this.topics = this.topics.filter(
      (topicR) => topicR.topic.toString() !== topicId.toString()
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
