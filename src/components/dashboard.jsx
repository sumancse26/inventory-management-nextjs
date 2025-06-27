"use client";

import { useEffect, useState } from "react";

import { dashboardAction } from "@/app/actions/dashboardAction";
const UserIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
    <path d="M12 7a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" />
  </svg>
);

const ProductIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 6H4v12h16V6z" />
    <path d="M22 6L12 13 2 6" />
  </svg>
);

const InvoiceIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const SaleIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 8c-1.333 0-4 1-4 4s2.667 4 4 4 4-1 4-4-2.667-4-4-4z" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const CollectionIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4-1.343 4-3-1.79-3-4-3z" />
    <path d="M4 8v8h4v-8H4zm12 0v8h4v-8h-4z" />
  </svg>
);

const Dashboard = () => {
  const [cards, setCards] = useState({});

  useEffect(() => {
    dashboardInfoHandler();

    return () => {};
  }, []);
  const dashboardInfoHandler = async () => {
    try {
      const res = await dashboardAction();

      setCards([
        {
          label: "Total Users",
          value: res.data?.total_users || 0,
          tooltip: "The number of daily users",
          color: "bg-blue-500",
          icon: <UserIcon />,
        },
        {
          label: "Products",
          value: res.data?.total_products || 0,
          color: "bg-green-500",
          icon: <ProductIcon />,
        },
        {
          label: "Total Invoices",
          value: res.data?.total_invoices || 0,
          color: "bg-yellow-500",
          icon: <InvoiceIcon />,
        },
        {
          label: "Total Sale",
          value: res.data?.total_sale || 0,
          color: "bg-red-500",
          icon: <SaleIcon />,
        },
        {
          label: "Total Collections",
          value: res.data?.total_collection || 0,
          color: "bg-indigo-500",
          icon: <CollectionIcon />,
        },
      ]);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.length > 0 &&
        cards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl shadow-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 transition hover:shadow-lg"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide flex items-center gap-1">
                {card.label}
                {card.tooltip && (
                  <div className="group relative cursor-pointer">
                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs text-white bg-gray-900 dark:bg-neutral-700 px-2 py-1 rounded shadow">
                      {card.tooltip}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mt-1 sm:mt-2">
                {card.value}
              </h3>
            </div>
            <div
              className={`ml-4 p-3 sm:p-4 rounded-full ${card.color} flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Dashboard;
