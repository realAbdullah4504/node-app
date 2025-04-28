const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

let channel, connection;

// Connect to RabbitMQ
async function connectRabbitMQ() {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();

    await channel.assertQueue('emailQueue');
    await channel.assertQueue('billingQueue');
}
connectRabbitMQ();

app.post('/send-email', async (req, res) => {
    const fakeUsers = Array.from({ length: 1000 }, (_, index) => ({
        email: `user${index + 1}@example.com`,
        subject: "Welcome to Our Service!",
        body: "Thank you for subscribing!",
    }));

    // Push each user into the queue
    fakeUsers.forEach(user => {
        channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify(user)));
    });

    res.send('1000 subscription tasks sent to queue');
});

app.post('/generate-invoice', async (req, res) => {
    const { userId, amount } = req.body;
    const message = { userId, amount };

    channel.sendToQueue('billingQueue', Buffer.from(JSON.stringify(message)));
    res.send('Invoice task sent to queue');
});

app.listen(5000, () => {
    console.log('API Gateway running on port 5000');
});
