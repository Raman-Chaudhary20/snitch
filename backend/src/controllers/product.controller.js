import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProductController(req, res) {
  const { title, description, images, priceAmount, priceCurrency } = req.body;
  console.log(req.body);
  console.log(req.user);

  const seller = req.user;

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );
  } catch (error) {
    console.log("IMAGEKIT ERROR:");
    console.log(error);
    console.log(error.message);
    console.log(error.response?.data);

    throw error;
  }

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images,
    seller: seller._id,
  });
  console.log(product);


  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
};

export async function getAllProductsController(req, res) {

  const user = req.user;

  const products = await productModel.find({ seller: user._id });
  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
};
