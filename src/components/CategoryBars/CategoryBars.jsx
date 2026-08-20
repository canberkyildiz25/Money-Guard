import React, { useMemo } from 'react';
import styles from './CategoryBars.module.css';

/**
 * Kategori harcaması — sıralı yatay çubuk.
 *
 * Yerini aldığı donut iki ayrı sebeple yanlıştı:
 *
 * 1. Yanlış form. Kategori harcaması bir *kimlik* verisi değil, *büyüklük*
 *    verisi: okuyucunun yapması gereken iş "hangisi daha büyük" karşılaştırması.
 *    Bunun formu çubuk, pasta değil. Pasta ancak parça-bütün ilişkisi asıl mesaj
 *    olduğunda ve dilim sayısı azken çalışır.
 *
 * 2. Yanlış palet. Sekiz kategorik renk kullanıyordu ve ikisi birebir aynıydı
 *    (#FF6384 listede iki kez geçiyordu), yani iki farklı kategori aynı rengi
 *    alıyordu. Kategorik palet renk körlüğü ayrımını da geçemezdi. Doğru formda
 *    büyüklüğü uzunluk taşıdığı için palete hiç ihtiyaç yok: tek ton yeter.
 *
 * Yedi kalemden sonrası "Diğer"e katlanıyor — daha fazla sınıfı daha fazla
 * renkle çözmek yerine kuyruk toplanır.
 */

const MAX_SATIR = 7;

const tl = (n) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n);

const tlTam = (n) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(n);

export default function CategoryBars({ categoryExpenses, total }) {
  const satirlar = useMemo(() => {
    const hepsi = Object.entries(categoryExpenses || {})
      .map(([ad, tutar]) => ({ ad, tutar }))
      .filter((s) => s.tutar > 0)
      .sort((a, b) => b.tutar - a.tutar);

    if (hepsi.length <= MAX_SATIR) return hepsi;

    const bas = hepsi.slice(0, MAX_SATIR - 1);
    const kuyruk = hepsi.slice(MAX_SATIR - 1);
    return [
      ...bas,
      { ad: 'Diğer', tutar: kuyruk.reduce((t, s) => t + s.tutar, 0), katlanmis: kuyruk.length },
    ];
  }, [categoryExpenses]);

  if (!satirlar.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Bu dönemde gider kaydı yok</p>
        <p className={styles.emptyBody}>
          İşlem eklediğinizde kategori dağılımı burada görünecek.
        </p>
      </div>
    );
  }

  const enBuyuk = satirlar[0].tutar;
  const toplam = total || satirlar.reduce((t, s) => t + s.tutar, 0);

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        Kategoriye göre gider
        <span className={styles.captionTotal}>{tlTam(toplam)}</span>
      </figcaption>

      {/* Tek seri olduğu için lejant yok — başlık zaten neyi gösterdiğini
          söylüyor. Değerler doğrudan etiketli, yani kimlik hiçbir zaman
          yalnızca renge bağlı değil. */}
      <ul className={styles.list}>
        {satirlar.map((s) => {
          const oran = (s.tutar / enBuyuk) * 100;
          const pay = toplam > 0 ? (s.tutar / toplam) * 100 : 0;
          return (
            <li key={s.ad} className={styles.row}>
              <div className={styles.rowHead}>
                <span className={styles.name}>
                  {s.ad}
                  {s.katlanmis ? (
                    <span className={styles.folded}> · {s.katlanmis} kategori</span>
                  ) : null}
                </span>
                <span className={styles.value}>{tl(s.tutar)}</span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.bar}
                  style={{ inlineSize: `${Math.max(oran, 1.5)}%` }}
                />
                <span className={styles.share}>%{pay.toFixed(1).replace('.', ',')}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Tablo görünümü: ekran okuyucu ve dışa aktarma için grafiğin
          sayısal karşılığı. */}
      <details className={styles.tableToggle}>
        <summary className={styles.summary}>Tabloyu göster</summary>
        <table className={styles.table}>
          <caption className={styles.srOnly}>Kategoriye göre gider dökümü</caption>
          <thead>
            <tr>
              <th scope="col">Kategori</th>
              <th scope="col" className={styles.numCol}>Tutar</th>
              <th scope="col" className={styles.numCol}>Pay</th>
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.ad}>
                <th scope="row" className={styles.rowHeader}>{s.ad}</th>
                <td className={styles.numCol}>{tlTam(s.tutar)}</td>
                <td className={styles.numCol}>
                  %{(toplam > 0 ? (s.tutar / toplam) * 100 : 0).toFixed(1).replace('.', ',')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className={styles.rowHeader}>Toplam</th>
              <td className={styles.numCol}>{tlTam(toplam)}</td>
              <td className={styles.numCol}>%100,0</td>
            </tr>
          </tfoot>
        </table>
      </details>
    </figure>
  );
}
