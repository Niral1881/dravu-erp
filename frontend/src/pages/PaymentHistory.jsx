import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {

  const API = import.meta.env.VITE_API_URL;

  const [payments, setPayments] =
    useState([]);


  const fetchPayments =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/payments`
          );

        setPayments(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchPayments();
    };

    loadProducts();

  }, []);

  return (

    <div className="p-3 md:p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
          Payment History
        </h1>

        <p className="text-gray-500">
          View all payment records
        </p>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="min-w-[900px] w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Party
              </th>

              <th className="text-left p-4">
                Invoice No
              </th>

              <th className="text-left p-4">
                Amount
              </th>

              <th className="text-left p-4">
                Mode
              </th>

              <th className="text-left p-4">
                Note
              </th>

            </tr>

          </thead>

          <tbody>

            {payments.map(
              (
                payment,
                index
              ) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">

                    {
                      new Date(
                        payment.paymentDate
                      ).toLocaleDateString(
                        "en-GB"
                      )
                    }

                  </td>

                  <td className="p-4 font-medium">

                    {
                      payment.partyName
                    }

                  </td>

                  <td className="p-4">

                    {
                      payment.invoiceNo
                    }

                  </td>

                  <td className="p-4 text-green-600 font-bold">

                    ₹ {
                      Number(
                        payment.amount || 0
                      ).toFixed(2)
                    }

                  </td>

                  <td className="p-4">

                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">

                      {payment.paymentMode}

                    </span>

                  </td>

                  <td className="p-4">

                    {
                      payment.note || "-"
                    }

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

export default PaymentHistory;