import Order from "../models/Orders.js";

// GET /orders → barcha buyurtmalar
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

// GET /orders/:id → bitta buyurtma
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

// POST /orders → yangi buyurtma qo‘shish
export const createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: "Buyurtma yaratishda xato", error });
    }
};

// PUT /orders/:id → yangilash (status yoki boshqa maydonlar)
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Yangilashda xato", error });
    }
};

// DELETE /orders/:id → o‘chirish
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
        res.status(200).json({ message: "Buyurtma o‘chirildi" });
    } catch (error) {
        res.status(500).json({ message: "O‘chirishda xato", error });
    }
};
