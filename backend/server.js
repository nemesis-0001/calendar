const express = require("express");
const app = express();
const cors = require("cors");

const allowedOrigins = [
  "https://customize-task-calendar.vercel.app",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://customize-task-calendar-api.onrender.com"
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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
