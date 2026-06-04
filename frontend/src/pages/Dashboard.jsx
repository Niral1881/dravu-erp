import {
  useEffect,
  useState,
} from "react";

import axios from "axios";


function Dashboard() {

  const API = import.meta.env.VITE_API_URL;
  const [parties, setParties] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [invoices, setInvoices] =
    useState([]);

  const fetchDashboardData = async () => {
    try {

      const partyRes = await axios.get(
        `${API}/parties`
      );

      const productRes = await axios.get(
        `${API}/products`
      );

      const invoiceRes = await axios.get(
        `${API}/invoicest`
      );

      setParties(partyRes.data);

      setProducts(productRes.data);

      setInvoices(invoiceRes.data);



    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchDashboardData();
    };

    loadProducts();

  }, []);

  // Total Sales
  const totalSales = invoices.reduce(
    (acc, item) =>
      acc + item.grandTotal,
    0
  );

  const totalParties =
    parties.length;

  // Total Invoices
  const totalInvoices =
    invoices.length;

  // Total Products
  const totalProducts =
    products.length;



  return (

    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to Dravu Fashion Hub ERP
        </p>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        {/* Sales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-gray-500">
            Total Sales
          </p>

          <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
            ₹ {totalSales.toFixed(2)}
          </h2>

        </div>

        {/* Parties */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-gray-500">
            Total Parties
          </p>

          <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
            {totalParties}
          </h2>

        </div>

        {/* Invoices */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-gray-500">
            Total Invoices
          </p>

          <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
            {totalInvoices}
          </h2>

        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-gray-500">
            Total Products
          </p>

          <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
            {totalProducts}
          </h2>

        </div>

      </div>


    </div>
  );
}

export default Dashboard;