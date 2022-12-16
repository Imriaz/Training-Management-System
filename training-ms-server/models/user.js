const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  //topic array for trainer
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  // topics: [
  //   {
  //     topic: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Topic",
  //     },
  //   },
  // ],
  imageUrl: {
    type: String,
  },

  isVerify: {
    type: Boolean,
    default: false,
  },

  verifyToken: String,
  verifyExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// userSchema.methods.addToTopic = async function (topicId) {
//   try {
//     this.topics.push({
//       topic: topicId,
//     });
//     await this.save();
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
