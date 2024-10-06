const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
require('dotenv').config();

connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});