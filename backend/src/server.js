import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import partyRoutes from "./routes/party.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import stockHistoryRoutes from "./routes/stockHistory.routes.js";
import returnRoutes from "./routes/return.routes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dravu-erp-1.onrender.com",
      "https://dravu-erp.vercel.app",
      "https://dravu-ob1thfici-niral-s-projects1.vercel.app",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stock-history", stockHistoryRoutes);
app.use("/api/returns", returnRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Dravu Fashion Hub API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});