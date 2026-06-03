import StockHistory
  from "../models/StockHistory.js";

export const getStockHistory =
  async (req, res) => {

    try {

      const history =
        await StockHistory.find()
          .sort({
            createdAt: -1,
          });

      res.json(history);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };