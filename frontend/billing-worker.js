const amqp = require('amqplib');

async function startBillingWorker() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('billingQueue');

    console.log('Billing Service is waiting for messages...');

    channel.consume('billingQueue',async (message) => {
        const input = JSON.parse(message.content.toString());
        console.log(`💰 Generating invoice for user ${input.userId} with amount $${input.amount}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        // Imagine real billing logic here...

        channel.ack(message); // Acknowledge the message
    });
}

startBillingWorker();
