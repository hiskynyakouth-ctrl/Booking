require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const session   = require("express-session");
const passport  = require("./config/passport");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/", (req, res) => res.json({
  status: "Thiyang API running ✅",
  db:     require("mongoose").connection.readyState === 1 ? "connected" : "disconnected",
  time:   new Date(),
}));

// Routes
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/payments",      require("./routes/payment"));
app.use("/api/users",         require("./routes/users"));
app.use("/api/mail",          require("./routes/mail"));
app.use("/api/bookings",      require("./routes/bookings"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/reset",         require("./routes/reset"));

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectDB();
});
