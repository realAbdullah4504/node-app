const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;



const JWT_SECRET = 'this_is_my_secret_key';

const user = {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('password', 8) // hashed password
};

app.get('/', (req, res) => {
    res.json('Hello World!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== user.username) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
}
);

app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ message: 'Protected content', userId: decoded.id, user: user });
    });
});

app.listen(port, () => {
    console.log(`jwt password app listening at http://localhost:${port}`);
})