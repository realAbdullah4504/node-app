const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const authRoutes=require('./routes/authRoutes');
const app = express();
const port=process.env.PORT;
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authRoutes);




app.listen(port, () => {
    console.log(`jwt password app listening at http://localhost:${port}`);
})