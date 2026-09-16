import React from 'react';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import styles from './CurrencyPage.module.css';

const CurrencyPage = () => {
  return (
    <div className={styles.currencyPage}>
      {/* Background SVG Elements */}

      <Header />
      
      <div className={styles.mainContainer}>
        <div className={styles.content}>
          <Navigation />
          <Currency />
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;
