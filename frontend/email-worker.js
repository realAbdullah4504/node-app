const amqp = require('amqplib');

async function startEmailWorker(workerId) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('emailQueue');

    console.log(`Email Worker-${workerId} is waiting for messages...`);

    channel.prefetch(1); // Limit to 1 message per worker at a time

    channel.consume('emailQueue', async (message) => {
        if (message) {
            const input = JSON.parse(message.content.toString());
            console.log(`Worker-${workerId} 📧 Sending email to ${input.email} with subject "${input.subject}"`);
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Imagine sending real email here...

            // Acknowledge the message after processing
            channel.ack(message);
        }
    });
}

// Start a single worker to process emails sequentially
startEmailWorker(1);
