const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notesRoutes');

const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/notes', notesRoutes);

const startServer = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Server error:', err.message);
    process.exit(1);
  }
};

startServer();