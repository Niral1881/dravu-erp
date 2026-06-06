import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function StockHistory() {

  const API = import.meta.env.VITE_API_URL;

  const [history, setHistory] =
    useState([]);



  const fetchHistory =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/stock-history`
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

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Stock History
      </h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="min-w-[900px] w-full">

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
                  className="border-b hover:bg-gray-50 transition"
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
                      className={`px-3 py-1 rounded-full text-sm font-bold ${item.type === "IN"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
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