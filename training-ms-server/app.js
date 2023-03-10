const express = require("express");
const adminRouter = require("./routes/admin");
const viewRouter = require("./routes/view");
const { failure } = require("./utils/commonResponse");
const HTTP_STATUS = require("./utils/httpStatus");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth");

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", adminRouter);
app.use(viewRouter);
app.use(authRouter);
app.use((req, res, next) => {
  res
    .status(HTTP_STATUS.BAD_REQUEST)
    .send(failure(`Can't ${req.method} ${req.url}`));
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .send(failure("Internal Server Error!", err.message));
});

databaseConnection(() => {
  app.listen(5000, () => {
    console.log("Application is running on 5000");
  });
});
