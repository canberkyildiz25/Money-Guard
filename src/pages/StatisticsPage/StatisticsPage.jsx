import React from 'react';
import { formatTRY } from "../../utils/currency";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import { selectTotalBalance } from '../../redux/transactions/selectors';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import StatisticsDashboard from '../../components/StatisticsDashboard/StatisticsDashboard';
import styles from './StatisticsPage.module.css';

const StatisticsPage = () => {
  const user = useSelector(selectUser);
  const totalBalance = useSelector(selectTotalBalance);

  return (
    <div className={styles.statisticsPage}>
      {/* Background SVG Elements */}
      
      <Header />
      
      <div className={styles.mainContainer}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          <Navigation />
          
          {/* Balance Section */}
          <div className={styles.balanceSection}>
            <h3 className={styles.balanceTitle}>TOPLAM BAKİYE</h3>
            <div className={styles.balanceAmount}>{formatTRY(totalBalance)}</div>
          </div>
          
          {/* Currency Component - API'den veri çekiyor */}
          <div className={styles.currencySection}>
            <Currency />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.content}>
            <h1 className={styles.pageTitle}>İstatistik</h1>
            <StatisticsDashboard />
          </div>
        </main>
      </div>

      {/* Tablet Layout - DashboardPage gibi */}
      <div className={styles.tabletContainer}>
        {/* Tablet için üst kısım - Navigation, Balance ve Currency */}
        <div className={styles.topSection}>
          <aside className={styles.sidebar}>
            {/* Sol taraf - Navigation ve Balance */}
            <div className={styles.leftSidebarContent}>
              <Navigation />

              {/* Balance */}
              <div className={styles.balanceSection}>
                <h3 className={styles.balanceTitle}>TOPLAM BAKİYE</h3>
                <div className={styles.balanceAmount}>{formatTRY(totalBalance)}</div>
              </div>
            </div>

            {/* Sağ taraf - Currency */}
            <div className={styles.currencySection}>
              <Currency />
            </div>
          </aside>
        </div>

        {/* Alt kısım - Statistics Dashboard */}
        <main className={styles.mainContent}>
          <div className={styles.statisticsContainer}>
            <h1 className={styles.pageTitle}>İstatistik</h1>
            <StatisticsDashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatisticsPage;
