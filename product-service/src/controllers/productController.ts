import { Request, Response, NextFunction } from "express";
import product from "../models/productModel";
import amqp from "amqplib";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const connectToRabbitMQ = async () => {
  try {
    const connection: amqp.Connection = await amqp.connect(
      process.env.RABBIT_MQ!
    );
    const channel: amqp.Channel = await connection.createChannel();
    await channel.assertQueue("Product", { durable: false });
    return channel;
  } catch (error: unknown) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

export class ProductController {
  async home(req: Request, res: Response, next: NextFunction) {
    return res.json({ success: true, message: "product servies test!" });
  }

  async productCreate(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);

    const { name, description, price } = req.body;
    try {
      if (!name || !description || !price) {
        return res.status(400).json({
          success: false,
          message: "Name, description, and price are required fields.",
        });
      }

      let ExistPro = await product.findOne({ name: name });
      if (ExistPro) {
        return res.json({
          success: false,
          message: "product already exist!",
        });
      }

      const allDetails = new product({
        name: name,
        description: description,
        price: price,
      });
      await allDetails.save();
      return res
        .status(200)
        .json({ success: true, message: "product created!" });
    } catch (error) {
      next(error);
    }
  }

  async productCheckout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    console.log(req.user, "user data");
    const { id } = req.user;
    console.log(req.body, "body");
    const { pid } = req.body;
    const proData = await product.find({ _id: pid });

    console.log(proData);

    const sendToRabbitMQ = async <T>(data: T) => {
      try {
        const channel: amqp.Channel | undefined = await connectToRabbitMQ();
        if (channel) {
          channel.sendToQueue("Orders", Buffer.from(JSON.stringify(data)));
          console.log("data sended to channel!");
        }
      } catch (error) {
        console.error("Error sending to RabbitMQ:", error);
      }
    };

    sendToRabbitMQ<any>({
      proData,
      id,
    });
  }
}
