import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Connect to database
    await connectToDatabase();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Noto'g'ri buyurtma identifikatori" },
        { status: 400 }
      );
    }

    // Find order by ID
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Buyurtma topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { message: "Buyurtma ma'lumotlarini olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}