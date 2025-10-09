const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const counselingRoutes = require("./routes/counselingRoutes");
const groupRoutes = require("./routes/groupRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/counseling", counselingRoutes);
app.use("/api/groups", groupRoutes);
