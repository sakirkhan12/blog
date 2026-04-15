require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes=require('./routes/adminRoutes')

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use('/api/users', userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin",adminRoutes)

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`server running port ${PORT}`);
});