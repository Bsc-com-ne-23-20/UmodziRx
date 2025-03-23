const amqp = require('amqplib');
const { Contract } = require('fabric-contract-api');

/**
 * Processes blockchain write tasks from the queue.
 */
const processBlockchainWrite = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'blockchain_write';

    await channel.assertQueue(queue, { durable: true });

    console.log('Blockchain Worker is waiting for tasks...');

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const { transactionData } = JSON.parse(msg.content.toString());

        try {
          // Simulate blockchain write
          const contract = new Contract('PrescriptionContract');
          const result = await contract.submitTransaction(
            'CreatePrescription',
            transactionData
          );

          console.log('Transaction successful:', result.toString());
          channel.ack(msg);
        } catch (error) {
          console.error('Blockchain write error:', error);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Blockchain Worker error:', error);
  }
};

processBlockchainWrite();
