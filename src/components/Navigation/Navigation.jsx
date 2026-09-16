import React from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/home.svg';
import statisticIcon from '../../assets/statistic.svg';
import currencyIcon from '../../assets/currency.svg';
import styles from './Navigation.module.css';

const Navigation = () => {
  const navItems = [
    {
      path: '/home',
      label: 'Ana sayfa',
      icon: homeIcon
    },
    {
      path: '/statistics',
      label: 'İstatistik',
      icon: statisticIcon
    },
    {
      path: '/currency',
      label: 'Döviz',
      icon: currencyIcon,
      mobileOnly: true
    }
  ];

  return (
    <nav className={styles.navigation}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''} ${item.mobileOnly ? styles.mobileOnly : ''}`
          }
        >
          <div className={styles.iconContainer}>
            {/* Etiket hemen yanında; ikon ekran okuyucuya ikinci kez okunmasın. */}
            <span
              aria-hidden="true"
              className={styles.navIcon}
              /* Tırnak şart: Vite 4 KB altı SVG'leri data: URI olarak satır içine
                 gömüyor; içindeki boşluk ve tırnaklar tırnaksız url() belirtecini
                 geçersiz kılıyor ve tarayıcı özelliği sessizce reddediyordu. */
              style={{ '--icon': `url("${item.icon}")` }}
            />
          </div>
          <span className={styles.navLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

