import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

/* Örnek kayıt. Pazarlama sayfasındaki tutarlar gerçek kullanıcı verisi değil;
   tablonun altında bu açıkça yazıyor. Uydurma bir başarı metriği yerine
   ürünün ne yaptığını gösteren bir örnek — iddia değil, gösterim. */
const KAYIT = [
  { tarih: '03.02', aciklama: 'Maaş',            kategori: 'Gelir',   tutar: 42500 },
  { tarih: '05.02', aciklama: 'Kira',            kategori: 'Konut',   tutar: -18000 },
  { tarih: '09.02', aciklama: 'Market',          kategori: 'Gıda',    tutar: -3240 },
  { tarih: '11.02', aciklama: 'Elektrik',        kategori: 'Fatura',  tutar: -1485 },
  { tarih: '14.02', aciklama: 'Serbest çalışma', kategori: 'Gelir',   tutar: 9750 },
  { tarih: '18.02', aciklama: 'Ulaşım',          kategori: 'Ulaşım',  tutar: -1120 },
  { tarih: '23.02', aciklama: 'Kitap',           kategori: 'Kişisel', tutar: -640 },
];

const tl = (n) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(n);

/* Yürüyen bakiye. Defterin sol marjında duran şey etiket değil, hesabın
   o satırdaki hâli — Hallmark sol-etiket/sağ-başlık kalıbını yasaklıyor ve
   bir defterde o sütun zaten veriye ait. */
const yuruyen = KAYIT.reduce((acc, s) => {
  const onceki = acc.length ? acc[acc.length - 1].bakiye : 0;
  acc.push({ ...s, bakiye: onceki + s.tutar });
  return acc;
}, []);

const LandingPage = () => {
  const sonBakiye = yuruyen[yuruyen.length - 1].bakiye;

  return (
    <div className={styles.page}>
      <header className={styles.letterhead}>
        <span className={styles.wordmark}>Money&nbsp;Guard</span>
        <nav className={styles.letterheadNav} aria-label="Hesap">
          <Link to="/login" className={styles.linkQuiet}>Giriş yap</Link>
          <Link to="/register" className={styles.ctaSolid}>Hesap aç</Link>
        </nav>
      </header>

      {/* ── Kapak. Katlamanın üstünde tek bir cümle; düğme yok, alt başlık
            yok. Sağ kenarda dönemin özeti, bir defter kapağındaki gibi. ── */}
      <section className={styles.marquee}>
        <h1 className={styles.marqueeTitle}>
          Her kuruşun
          <br />
          bir satırı var
        </h1>

        <dl className={styles.period}>
          <div className={styles.periodRow}>
            <dt>Dönem</dt>
            <dd className={styles.num}>Şubat 2026</dd>
          </div>
          <div className={styles.periodRow}>
            <dt>Kayıt</dt>
            <dd className={styles.num}>{yuruyen.length}</dd>
          </div>
          <div className={styles.periodRow}>
            <dt>Bakiye</dt>
            <dd className={`${styles.num} ${styles.periodTotal}`}>{tl(sonBakiye)}</dd>
          </div>
        </dl>
      </section>

      <hr className={styles.ruleThick} aria-hidden="true" />

      {/* ── Katlamanın altı başka bir şeye dönüşüyor: kenardan kenara
            uzanan defterin kendisi. ── */}
      <section className={styles.sheet} aria-labelledby="kayit-basligi">
        <div className={styles.sheetHead}>
          <h2 id="kayit-basligi" className={styles.sheetTitle}>
            Kayıt böyle görünüyor
          </h2>
          <p className={styles.sheetNote}>
            Money Guard bir bütçe koçu değil, bir defter. Ne kazandığınızı ve ne
            harcadığınızı yazarsınız; toplamı, kategori dağılımını ve günün
            kurunu o çıkarır.
          </p>
        </div>

        <div className={styles.ledgerScroll}>
          <table className={styles.ledger}>
            <caption className={styles.srOnly}>
              Yürüyen bakiyeli bir aylık örnek gelir ve gider kaydı
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.colDate}>Tarih</th>
                <th scope="col">Açıklama</th>
                <th scope="col" className={styles.colCat}>Kategori</th>
                <th scope="col" className={styles.colAmount}>Tutar</th>
                <th scope="col" className={styles.colBalance}>Bakiye</th>
              </tr>
            </thead>
            <tbody>
              {yuruyen.map((s) => (
                <tr key={s.tarih + s.aciklama}>
                  <td className={`${styles.colDate} ${styles.num}`}>{s.tarih}</td>
                  <td className={styles.colDesc}>{s.aciklama}</td>
                  <td className={styles.colCat}>{s.kategori}</td>
                  <td
                    className={`${styles.colAmount} ${styles.num} ${
                      s.tutar >= 0 ? styles.gelir : styles.gider
                    }`}
                  >
                    {tl(s.tutar)}
                  </td>
                  <td className={`${styles.colBalance} ${styles.num}`}>{tl(s.bakiye)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={styles.caption}>Örnek kayıt — gerçek kullanıcı verisi değildir.</p>
      </section>

      {/* ── Defterin tuttukları. Dört eşit kart değil: biri ürünün asıl işi,
            üçü onu destekleyen satırlar. ── */}
      <section className={styles.keeps} aria-labelledby="tutulanlar">
        <h2 id="tutulanlar" className={styles.keepLeadTitle}>
          Gelir ve gider kaydı
        </h2>
        <p className={styles.keepLeadBody}>
          Her işlem tarih, kategori ve açıklamasıyla yazılır. Geçmişi
          filtreler, yanlış girdiyi düzeltir, silmek istediğinizi silersiniz.
          Uygulamanın yaptığı asıl iş budur; geri kalanı bunun üzerine kurulur.
        </p>

        <dl className={styles.keepList}>
          <div className={styles.keepRow}>
            <dt className={styles.keepTerm}>Kategori dökümü</dt>
            <dd className={styles.keepDesc}>
              Aylık harcamanın nereye gittiğini kategori kategori, büyükten
              küçüğe sıralar.
            </dd>
          </div>
          <div className={styles.keepRow}>
            <dt className={styles.keepTerm}>Döviz kuru</dt>
            <dd className={styles.keepDesc}>
              Dolar ve euro kurlarını çeker, hesabınızı güncel kurdan çevirir.
            </dd>
          </div>
          <div className={styles.keepRow}>
            <dt className={styles.keepTerm}>Hesap güvenliği</dt>
            <dd className={styles.keepDesc}>
              JWT ile kimlik doğrulama. Kayıtlarınızı yalnızca kendi oturumunuz
              görür.
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <Link to="/register" className={styles.ctaSolid}>Hesap aç</Link>
          <Link to="/login" className={styles.ctaOutline}>Giriş yap</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerLine}>
          Tuttuğunuz defter, verdiğiniz kararın yarısıdır.
        </p>
        <div className={styles.footerMeta}>
          <span className={styles.wordmark}>Money&nbsp;Guard</span>
          <span className={styles.footerNote}>© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
