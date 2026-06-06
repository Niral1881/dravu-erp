
import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {

  const API = import.meta.env.VITE_API_URL;

  const [invoices, setInvoices] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [returns, setReturns] =
    useState([]);

  const [parties, setParties] =
    useState([]);



  const fetchData =
    async () => {

      try {

        const invoiceRes =
          await axios.get(
            `${API}/invoices`
          );

        const paymentRes =
          await axios.get(
            `${API}/payments`
          );

        const productRes =
          await axios.get(
            `${API}/products`
          );

        const returnRes =
          await axios.get(
            `${API}/returns`
          );

        const partyRes =
          await axios.get(
            `${API}/parties`
          );

        setInvoices(
          invoiceRes.data
        );

        setPayments(
          paymentRes.data
        );

        setProducts(
          productRes.data
        );

        setReturns(
          returnRes.data
        );

        setParties(
          partyRes.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchData();
    };

    loadProducts();

  }, []);

  // CALCULATIONS

  const totalSales =
    invoices.reduce(
      (acc, item) =>
        acc +
        (item.roundedTotal || 0),
      0
    );

  const totalPayments =
    payments.reduce(
      (acc, item) =>
        acc +
        (item.amount || 0),
      0
    );

  const totalPending =
    invoices.reduce(
      (acc, item) =>
        acc +
        (item.pendingAmount || 0),
      0
    );

  const totalReturns =
    returns.reduce(
      (acc, item) =>
        acc +
        (item.qty || 0),
      0
    );

  const lowStockProducts =
    products.filter(
      (item) =>
        item.stock < 10
    );



  return (

    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
          Reports Dashboard
        </h1>

        <p className="text-gray-500">
          Business analytics & reports
        </p>

      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition">

          <p className="text-gray-500 mb-2">
            Total Sales
          </p>

          <h2 className="text-3xl font-bold text-[#2F9CAF]">

            ₹ {
              totalSales.toFixed(2)
            }

          </h2>

        </div>

        {/* Total Payments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Total Payments
          </p>

          <h2 className="text-3xl font-bold text-green-600">

            ₹ {
              totalPayments.toFixed(2)
            }

          </h2>

        </div>

        {/* Pending Amount */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Pending Amount
          </p>

          <h2 className="text-3xl font-bold text-red-500">

            ₹ {
              totalPending.toFixed(2)
            }

          </h2>

        </div>

        {/* Total Returns */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Total Returns
          </p>

          <h2 className="text-3xl font-bold text-yellow-500">

            {totalReturns}

          </h2>

        </div>

      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Products */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Products
          </p>

          <h2 className="text-3xl font-bold">

            {products.length}

          </h2>

        </div>

        {/* Low Stock */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Low Stock
          </p>

          <h2 className="text-3xl font-bold text-red-500">

            {
              lowStockProducts.length
            }

          </h2>

        </div>

        {/* Parties */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Parties
          </p>

          <h2 className="text-3xl font-bold">

            {parties.length}

          </h2>

        </div>

        {/* Invoices */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <p className="text-gray-500 mb-2">
            Invoices
          </p>

          <h2 className="text-3xl font-bold">

            {invoices.length}

          </h2>

        </div>

      </div>

      {/* LOW STOCK TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <div className="p-5 border-b">

          <h2 className="text-2xl font-bold text-[#2E3A3F]">

            Low Stock Products

          </h2>

        </div>

        <table className="min-w-[900px] w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Rate
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

            </tr>

          </thead>

          <tbody>

            {lowStockProducts.map(
              (product) => (

                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">

                    {product.name}

                  </td>

                  <td className="p-4">

                    ₹ {
                      product.rate
                    }

                  </td>

                  <td className="p-4 text-red-500 font-bold">

                    {product.stock}

                  </td>

                </tr>
              )
            )}

            {lowStockProducts.length === 0 && (

              <tr>

                <td
                  colSpan="3"
                  className="text-center p-5 text-gray-500"
                >

                  No low stock products

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Reports;
