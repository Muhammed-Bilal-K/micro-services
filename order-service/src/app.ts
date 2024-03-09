import express from "express";
import cookieParser from "cookie-parser";
import "./configdb/db";
import amqp from "amqplib";
import order from "./models/ordersModel";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectToRabbitMQ = async () => {
  try {
    const connection: amqp.Connection = await amqp.connect(
      process.env.RABBIT_MQ!
    );
    const channel: amqp.Channel = await connection.createChannel();
    await channel.assertQueue("Orders", { durable: false });
    return channel;
  } catch (error: unknown) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

const createOrder = async (alldata: any) => {
  console.log(alldata, "from order create");
  const { proData, id } = alldata;

  let total = 0;
  for (let i = 0; i < proData.length; i++) {
    total = total + parseInt(proData[i].price);
  }

  let orderData = {
    productId: proData._id,
  };

  const allDetails = new order({
    orderlist: orderData,
    userId: id,
    totalprice: total,
  });
  await allDetails.save();
};

const ConnectConsumer = async () => {
  try {
    const channel: amqp.Channel | undefined = await connectToRabbitMQ();
    if (channel) {
      await channel.consume(
        "Orders",
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg != null) {
            const message = JSON.parse(msg.content.toString());
            createOrder(message);
            channel.ack(msg);
          }
        }
      );
    } else {
      console.log("out");
    }
  } catch (error: unknown) {
    console.error("Error consuming from RabbitMQ:", error);
  }
};

ConnectConsumer();

const PORT = process.env.Port || 3003;

const start = () => {
  app.listen(PORT, () => {
    console.log(`orders server has been connected on http://localhost:${PORT}`);
  });
};

start();
