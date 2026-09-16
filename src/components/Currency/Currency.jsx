import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencyRates } from "../../redux/monobank/operations";
import {
  selectCurrencies,
  selectCurrencyLoading,
  selectCurrencyError,
} from "../../redux/monobank/selectors";
import styles from "./Currency.module.css";

/* Kur: iki ondalık, Türkçe virgül. */
const oran = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const Currency = () => {
  const dispatch = useDispatch();
  const currencies = useSelector(selectCurrencies) || [];
  const loading = useSelector(selectCurrencyLoading);
  const error = useSelector(selectCurrencyError);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);



  // Fallback veri oluştur
  const fallbackCurrencies = [
    { currency: "USD", purchase: "41.05", sale: "41.49" },
    { currency: "EUR", purchase: "47.90", sale: "48.53" }
  ];

  const displayCurrencies = currencies.length > 0 ? currencies : fallbackCurrencies;

  if (loading) {
    return (
      <div className={styles.currencySection}>
        <div className={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.currencySection}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.currencySection}>
      {/* Tablo */}
      <div className={styles.currencyTable}>
        <div className={styles.currencyHeader}>
          <span className={styles.hCurrency}>Döviz</span>
          <span className={styles.hCol}>Alış</span>
          <span className={styles.hCol}>Satış</span>
        </div>

        {displayCurrencies.map((c, i) => {
          const purchase = Number(c.purchase ?? 0);
          const sale = Number(c.sale ?? 0);
          return (
            <div key={i} className={styles.currencyRow}>
              <span className={styles.cellCurrency}>{c.currency}</span>
              <span className={styles.cellCenter}>
                {isFinite(purchase) ? oran(purchase) : "–"}
              </span>
              <span className={styles.cellCenter}>
                {isFinite(sale) ? oran(sale) : "–"}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Currency;
