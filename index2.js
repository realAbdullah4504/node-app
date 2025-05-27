const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authRoutesDatabase = require('./routes/authRoutesDatabase');
const notesRoutes = require('./routes/notesRoutes');
const notesRoutesDb = require('./routes/notesRoutesDb');
const mongoose=require('mongoose')

const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', authRoutes);
app.use('/api', authRoutesDatabase);
// app.use('/api/notes', notesRoutes);
app.use('/api/notes', notesRoutesDb);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

startServer();