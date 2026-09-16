import React, { useMemo, useState } from "react";
import { formatTRY } from "../../utils/currency";
import { useSelector } from "react-redux";
import {
  selectTransactions,
  selectTransactionCategories,
} from "../../redux/transactions/selectors";
import CategoryBars from "../CategoryBars/CategoryBars";

import FloatingDropdown from "../FloatingDropdown/FloatingDropdown";
import styles from "./StatisticsDashboard.module.css";



const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const StatisticsDashboard = () => {
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectTransactionCategories);
  const currentYear = new Date().getFullYear();

  /* Varsayilan ay sabit "September" yaziliydi: sayfa hangi ayda acilirsa
     acilsin Eylul ayini gosteriyordu, yani yilin 11 ayinda bos bir grafikle
     aciliyordu. Icinde bulunulan ay dogru varsayilan. */
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
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
  const monthOptions = months.map((month, i) => ({
    value: month,
    label: AYLAR[i],
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
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryExpenses: {}
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

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryExpenses,
    };
  }, [filteredTransactions, categories]);


  return (
    <div className={styles.statisticsDashboard}>
      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        {/* Main Content - Chart (Sol) ve Expense Details (Sağ) */}
        <div className={styles.dashboardContent}>
          {/* Left Side - Chart */}
          <div className={styles.chartSection}>
            <div className={styles.chartContainer}>
              <CategoryBars
                categoryExpenses={statistics.categoryExpenses}
                total={statistics.totalExpense}
              />
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
                  placeholder="Ay seçin"
                  className={styles.statisticsTrigger}
                />

                <FloatingDropdown
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  placeholder="Yıl seçin"
                  className={styles.statisticsTrigger}
                />
              </div>
            </div>

            {filteredTransactions && filteredTransactions.length > 0 ? (
              <div className={styles.transactionsTable}>
                <div className={styles.tableHeader}>
                  <span>Kategori</span>
                  <span>Açıklama</span>
                  <span>Tutar</span>
                </div>

                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === "INCOME";
                  const categoryName = isIncome
                    ? "Gelir"
                    : getCategoryName(transaction.categoryId);


                  return (
                    <div key={transaction.id} className={styles.tableRow}>
                      <span className={styles.category}>
                        {categoryName}
                      </span>

                      <span className={styles.comment}>
                        {transaction.comment}
                      </span>

                      <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                        {formatTRY(Math.abs(transaction.amount))}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noTransactions}>
                <p>
                  {AYLAR[months.indexOf(selectedMonth)]} {selectedYear} için kayıt yok
                </p>
              </div>
            )}

            {/* Summary Totals */}
            <div className={styles.summaryTotals}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Gider</span>
                <span className={styles.summaryValue}>
                  {formatTRY(statistics.totalExpense)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Gelir</span>
                <span className={`${styles.summaryValue} ${styles.income}`}>
                  {formatTRY(statistics.totalIncome)}
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
            <CategoryBars
                categoryExpenses={statistics.categoryExpenses}
                total={statistics.totalExpense}
              />
          </div>
        </div>

        {/* Mobile Filters Section */}
        <div className={styles.mobileFiltersSection}>
          <div className={styles.mobileFilters}>
            <FloatingDropdown
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Ay seçin"
              className={styles.mobileStatisticsTrigger}
            />

            <FloatingDropdown
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Yıl seçin"
              className={styles.mobileStatisticsTrigger}
            />
          </div>
        </div>

        {/* Mobile Transaction Details */}
        <div className={styles.mobileTransactionDetails}>
          {filteredTransactions.length > 0 ? (
            <div className={styles.mobileTransactionsTable}>
              <div className={styles.mobileTableHeader}>
                <span>Kategori</span>
                <span>Tutar</span>
              </div>

              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";
                const categoryName = isIncome
                  ? "Gelir"
                  : getCategoryName(transaction.categoryId);
                
                return (
                  <div key={transaction.id} className={styles.mobileTableRow}>
                    <span className={styles.mobileCategory}>
                      {categoryName}
                    </span>
                    <span className={`${styles.mobileAmount} ${isIncome ? styles.mobileIncome : ''}`}>
                      {formatTRY(Math.abs(transaction.amount))}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.mobileNoTransactions}>
              <p>
                {AYLAR[months.indexOf(selectedMonth)]} {selectedYear} için kayıt yok
              </p>
            </div>
          )}

          {/* Mobile Summary Totals */}
          <div className={styles.mobileSummaryTotals}>
            <div className={styles.mobileSummaryItem}>
              <span className={styles.mobileSummaryLabel}>Gider</span>
              <span className={styles.mobileSummaryValue}>
                {formatTRY(statistics.totalExpense)}
              </span>
            </div>
            <div className={styles.mobileSummaryItem}>
              <span className={styles.mobileSummaryLabel}>Gelir</span>
              <span className={`${styles.mobileSummaryValue} ${styles.mobileIncome}`}>
                {formatTRY(statistics.totalIncome)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
