//imports
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

//middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// route imports
const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");

//routes
app.use("/user", userRoutes);
app.use("/", homeRoutes);

//db connection
mongoose
  .connect(process.env.DB_URL, {})
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

//error handler
// app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening on http://localhost:${process.env.PORT}`);
});
