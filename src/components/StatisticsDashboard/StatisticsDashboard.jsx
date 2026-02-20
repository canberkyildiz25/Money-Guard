import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectTransactions,
  selectTransactionCategories,
} from "../../redux/transactions/selectors";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FloatingDropdown from "../FloatingDropdown/FloatingDropdown";
import styles from "./StatisticsDashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsDashboard = () => {
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectTransactionCategories);
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = useMemo(
    () => Array.from({ length: currentYear - 2020 + 1 }, (_, i) => String(2020 + i)),
    [currentYear]
  );

  // Convert arrays to options format for FloatingDropdown
  const monthOptions = months.map(month => ({
    value: month,
    label: month
  }));

  const yearOptions = years.map(year => ({
    value: year,
    label: year
  }));

  // Kategori ID'lerini kategori adlarına eşle
  const getCategoryName = (categoryId) => {
    if (!categories || !categoryId) return "Unknown";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Seçilen ay ve yıra göre transaction'ları filtrele
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const monthIndex = months.indexOf(selectedMonth);
    const year = parseInt(selectedYear);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      return transactionMonth === monthIndex && transactionYear === year;
    });
  }, [transactions, selectedMonth, selectedYear, months]);

  const statistics = useMemo(() => {
    const emptyChartData = {
      labels: ["No data"],
      datasets: [
        {
          data: [1],
          backgroundColor: ["rgba(201, 203, 207, 0.35)"],
          borderColor: ["rgba(201, 203, 207, 0.45)"],
          borderWidth: 2,
          hoverOffset: 0,
        },
      ],
    };

    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryExpenses: {},
        chartData: emptyChartData,
      };
    }

    // Kategori ID'lerini kategori adlarına eşle
    const categoryMap = {};
    if (categories) {
      categories.forEach((category) => {
        categoryMap[category.id] = category.name;
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    // Sadece EXPENSE transaction'ları işle
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "INCOME") {
        totalIncome += Math.abs(transaction.amount);
      } else if (transaction.type === "EXPENSE") {
        totalExpense += Math.abs(transaction.amount);

        // Kategori adını bul
        const categoryName =
          categoryMap[transaction.categoryId] || "Other expenses";
        if (!categoryExpenses[categoryName]) {
          categoryExpenses[categoryName] = 0;
        }
        categoryExpenses[categoryName] += Math.abs(transaction.amount);
      }
    });

    const balance = totalIncome - totalExpense;

    // Chart için sadece expense verilerini hazırla - her kategori için farklı renk
    const labels = Object.keys(categoryExpenses);
    const data = Object.values(categoryExpenses);

    // Her kategori için farklı renk kullan
    const colors = [
      "#FF6384", // Pembe
      "#36A2EB", // Mavi
      "#FFCE56", // Sarı
      "#4BC0C0", // Turkuaz
      "#9966FF", // Mor
      "#FF9F40", // Turuncu
      "#FF6384", // Pembe
      "#C9CBCF", // Gri
    ];

    const hasExpenseData = labels.length > 0;

    if (totalIncome > 0) {
      labels.push("Income");
      data.push(totalIncome);
    }

    const chartData = hasExpenseData || totalIncome > 0
      ? {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                ...colors.slice(0, Object.keys(categoryExpenses).length),
                ...(totalIncome > 0 ? ["#FFB627"] : []),
              ],
              borderColor: [
                ...colors
                  .slice(0, Object.keys(categoryExpenses).length)
                  .map((color) => color + "80"),
                ...(totalIncome > 0 ? ["#FFB62780"] : []),
              ],
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        }
      : emptyChartData;

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryExpenses,
      chartData,
    };
  }, [filteredTransactions, categories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: €${value.toLocaleString(
              "en-IN"
            )} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className={styles.statisticsDashboard}>
      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        {/* Main Content - Chart (Sol) ve Expense Details (Sağ) */}
        <div className={styles.dashboardContent}>
          {/* Left Side - Chart */}
          <div className={styles.chartSection}>
            <div className={styles.chartContainer}>
              <Doughnut data={statistics.chartData} options={chartOptions} />
              <div className={styles.chartCenter}>
                <div className={styles.balanceText}>
                  €{" "}
                  {statistics.balance}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Expense Details */}
          <div className={styles.expenseDetailsSection}>
            {/* Header with Filters */}
            <div className={styles.dashboardHeader}>
              <div className={styles.filters}>
                <FloatingDropdown
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  placeholder="Select month"
                  className={styles.statisticsTrigger}
                />

                <FloatingDropdown
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  placeholder="Select year"
                  className={styles.statisticsTrigger}
                />
              </div>
            </div>

            {filteredTransactions && filteredTransactions.length > 0 ? (
              <div className={styles.transactionsTable}>
                <div className={styles.tableHeader}>
                  <span>Category</span>
                  <span>Comment</span>
                  <span>Amount</span>
                </div>

                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === "INCOME";
                  const categoryName = isIncome
                    ? "Income"
                    : getCategoryName(transaction.categoryId);

                  // Kategori için renk bul
                  const categoryIndex = Object.keys(statistics.categoryExpenses).indexOf(categoryName);
                  const categoryColor =
                    isIncome
                      ? "#FFB627"
                      : statistics.chartData.datasets[0].backgroundColor[categoryIndex] || "#C9CBCF";

                  return (
                    <div key={transaction.id} className={styles.tableRow}>
                      <span className={styles.category}>
                        <div
                          className={styles.categoryColorBox}
                          style={{ backgroundColor: categoryColor }}
                        />
                        {categoryName}
                      </span>

                      <span className={styles.comment}>
                        {transaction.comment}
                      </span>

                      <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                        €
                        {Math.abs(transaction.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noTransactions}>
                <p>
                  No transactions found for {selectedMonth} {selectedYear}
                </p>
              </div>
            )}

            {/* Summary Totals */}
            <div className={styles.summaryTotals}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Expenses:</span>
                <span className={styles.summaryValue}>
                  €
                  {statistics.totalExpense.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Income:</span>
                <span className={`${styles.summaryValue} ${styles.income}`}>
                  €
                  {statistics.totalIncome.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={styles.mobileLayout}>
        {/* Chart Section */}
        <div className={styles.mobileChartSection}>
          <div className={styles.mobileChartContainer}>
            <Doughnut data={statistics.chartData} options={chartOptions} />
            <div className={styles.mobileChartCenter}>
              <div className={styles.mobileBalanceText}>
                €{" "}
                {statistics.balance}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Section */}
        <div className={styles.mobileFiltersSection}>
          <div className={styles.mobileFilters}>
            <FloatingDropdown
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Select month"
              className={styles.mobileStatisticsTrigger}
            />

            <FloatingDropdown
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Select year"
              className={styles.mobileStatisticsTrigger}
            />
          </div>
        </div>

        {/* Mobile Transaction Details */}
        <div className={styles.mobileTransactionDetails}>
          {filteredTransactions.length > 0 ? (
            <div className={styles.mobileTransactionsTable}>
              <div className={styles.mobileTableHeader}>
                <span>Category</span>
                <span>Amount</span>
              </div>

              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";
                const categoryName = isIncome
                  ? "Income"
                  : getCategoryName(transaction.categoryId);
                const categoryIndex = Object.keys(statistics.categoryExpenses).indexOf(categoryName);
                const categoryColor =
                  isIncome
                    ? "#FFB627"
                    : statistics.chartData.datasets[0].backgroundColor[categoryIndex] || "#C9CBCF";
                
                return (
                  <div key={transaction.id} className={styles.mobileTableRow}>
                    <span className={styles.mobileCategory}>
                      <div
                        className={styles.mobileCategoryColorBox}
                        style={{ backgroundColor: categoryColor }}
                      />
                      {categoryName}
                    </span>
                    <span className={`${styles.mobileAmount} ${isIncome ? styles.mobileIncome : ''}`}>
                      €{Math.abs(transaction.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.mobileNoTransactions}>
              <p>
                No transactions found for {selectedMonth} {selectedYear}
              </p>
            </div>
          )}

          {/* Mobile Summary Totals */}
          <div className={styles.mobileSummaryTotals}>
            <div className={styles.mobileSummaryItem}>
              <span className={styles.mobileSummaryLabel}>Expenses:</span>
              <span className={styles.mobileSummaryValue}>
                €
                {statistics.totalExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className={styles.mobileSummaryItem}>
              <span className={styles.mobileSummaryLabel}>Income:</span>
              <span className={`${styles.mobileSummaryValue} ${styles.mobileIncome}`}>
                €
                {statistics.totalIncome.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
