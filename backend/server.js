const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const db = require("./config/dbConfig");

const allowedOrigins = [
  "https://customize-task-calendar.vercel.app/",
  "https://customize-task-calendar-api.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

const loginRoute = require("./routes/userRoutes");
const eventRoute = require("./routes/eventRoutes");

app.use("/user", loginRoute);
app.use("/task", eventRoute);

const port = import.meta.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
