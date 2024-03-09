import express from "express";
const router = express.Router();
import { ProductController }from '../controllers/productController';
import { verifyToken } from "../middleware/verifyPrdU";

const productController = new ProductController();

// router.get('/', productController.home);
// router.get('/product/checkout', productController.home);
router.post('/product/create', productController.productCreate);
router.post('/product/checkout', verifyToken , productController.productCheckout );

export default router;