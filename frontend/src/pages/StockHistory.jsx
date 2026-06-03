import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function StockHistory() {

  const [history, setHistory] =
    useState([]);



  const fetchHistory =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/stock-history"
          );

        setHistory(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchHistory();
    };

    loadProducts();

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Stock History
      </h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Qty
              </th>

              <th className="p-4 text-left">
                Before
              </th>

              <th className="p-4 text-left">
                After
              </th>

              <th className="p-4 text-left">
                Note
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map(
              (item) => (

                <tr
                  key={item._id}
                  className="border-b"
                >

                  <td className="p-4">

                    {
                      new Date(
                        item.createdAt
                      ).toLocaleDateString(
                        "en-GB"
                      )
                    }

                  </td>

                  <td className="p-4">

                    {
                      item.productName
                    }

                  </td>

                  <td className="p-4">

                    <span
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-full"
                    >

                      {item.type}

                    </span>

                  </td>

                  <td className="p-4">

                    {item.qty}

                  </td>

                  <td className="p-4">

                    {
                      item.stockBefore
                    }

                  </td>

                  <td className="p-4">

                    {
                      item.stockAfter
                    }

                  </td>

                  <td className="p-4">

                    {item.note}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default StockHistory;