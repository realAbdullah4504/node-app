const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
