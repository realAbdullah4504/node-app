const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;



app.get('/', (req, res) => {
    res.json('Hello World!');
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})