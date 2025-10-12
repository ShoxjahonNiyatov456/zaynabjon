import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();
    const { phoneNumber, location, products } = body;

    // Validate request data
    if (!phoneNumber || !location || !products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "Telefon raqami, manzil va mahsulotlar talab qilinadi" },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      phoneNumber,
      location,
      products,
      totalPrice,
      history: [{ status: "pending", date: new Date() }]
    });

    return NextResponse.json(
      {
        message: "Buyurtma muvaffaqiyatli yaratildi",
        orderId: order._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Buyurtma yaratishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get orders
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: "Buyurtmalarni olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}