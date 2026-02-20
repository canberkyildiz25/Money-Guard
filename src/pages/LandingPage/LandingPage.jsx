import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.page}>
      {/* Arka plan animasyon efekti */}
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.bgBlob3} />

      {/* Üst navbar */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <span className={styles.logoText}>Money Guard</span>
        </div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.navLogin}>Giriş Yap</Link>
          <Link to="/register" className={styles.navRegister}>Kayıt Ol</Link>
        </nav>
      </header>

      {/* Hero Bölümü */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroBadge}>Kişisel Finans Yönetimi</p>
          <h1 className={styles.heroTitle}>
            Paranızı Akıllıca
            <span className={styles.heroTitleAccent}> Yönetin</span>
          </h1>
          <p className={styles.heroDesc}>
            Gelir ve giderlerinizi kolayca takip edin, harcamalarınızı kategorilere göre analiz edin,
            güncel döviz kurlarını anlık izleyin. Finansal özgürlüğünüz bir adım uzağınızda.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register" className={styles.ctaPrimary}>
              Ücretsiz Başla
            </Link>
            <Link to="/login" className={styles.ctaSecondary}>
              Giriş Yap
            </Link>
          </div>
        </div>

        {/* Mock dashboard kartı */}
        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockCardHeader}>
              <span className={styles.mockDot} style={{ background: '#ef4444' }} />
              <span className={styles.mockDot} style={{ background: '#f59e0b' }} />
              <span className={styles.mockDot} style={{ background: '#10b981' }} />
            </div>
            <div className={styles.mockBalance}>
              <span className={styles.mockBalanceLabel}>Toplam Bakiye</span>
              <span className={styles.mockBalanceAmount}>₺ 24.580,00</span>
            </div>
            <div className={styles.mockTransactions}>
              {[
                { type: '+', label: 'Maaş', amount: '₺ 15.000', color: '#10b981' },
                { type: '-', label: 'Kira', amount: '₺ 4.500', color: '#ef4444' },
                { type: '-', label: 'Market', amount: '₺ 1.200', color: '#ef4444' },
                { type: '+', label: 'Freelance', amount: '₺ 3.500', color: '#10b981' },
              ].map((tx, i) => (
                <div key={i} className={styles.mockTxRow}>
                  <span className={styles.mockTxType} style={{ color: tx.color }}>{tx.type}</span>
                  <span className={styles.mockTxLabel}>{tx.label}</span>
                  <span className={styles.mockTxAmount} style={{ color: tx.color }}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Neler Yapabilirsiniz?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Gelir & Gider Takibi</h3>
            <p className={styles.featureDesc}>
              Her işleminizi tarih, kategori ve açıklamayla kaydedin. Geçmiş
              harcamalarınızı kolayca filtreleyin ve yönetin.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3 className={styles.featureTitle}>Detaylı İstatistikler</h3>
            <p className={styles.featureDesc}>
              Kategori bazlı pasta grafikler ve aylık raporlarla harcama
              alışkanlıklarınızı analiz edin.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💱</div>
            <h3 className={styles.featureTitle}>Canlı Döviz Kurları</h3>
            <p className={styles.featureDesc}>
              USD ve EUR kurlarını Monobank API ile anlık takip edin. Döviz
              grafiklerini saniyede saniyeye izleyin.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Güvenli Hesap</h3>
            <p className={styles.featureDesc}>
              JWT tabanlı kimlik doğrulama ile verileriniz her zaman güvende.
              Sadece siz görebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Alt CTA Bölümü */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaCard}>
          <h2 className={styles.bottomCtaTitle}>Hemen Başlayın</h2>
          <p className={styles.bottomCtaDesc}>
            Ücretsiz hesap oluşturun ve finansal kontrolü elinize alın.
          </p>
          <Link to="/register" className={styles.ctaPrimary}>
            Ücretsiz Hesap Oluştur
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2026 Money Guard — Tüm hakları saklıdır.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
