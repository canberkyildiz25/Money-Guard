/**
 * Demo kipi verisi.
 *
 * Uygulama üçüncü taraf bir eğitim API'sine (wallet.b.goit.study) bağlı.
 * Portfolyoya bakan birinin ekranları görebilmesi için oraya hesap açması
 * gerekiyordu; bu hem bir engel hem de o sunucu kapandığı gün demo ölür.
 *
 * Demo kipi ağa hiç çıkmaz. Bütün istekler bellekteki bu veriyle karşılanır,
 * ekleme ve silme gerçekten çalışır, sayfa yenilenene kadar kalıcıdır.
 * Ziyaretçi hiçbir yere kayıt olmaz, hiçbir veri gönderilmez.
 */

export const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo Kullanıcı',
  email: 'demo@moneyguard.local',
  balance: 0,
};

export const DEMO_TOKEN = 'demo-token';

export const DEMO_CATEGORIES = [
  { id: 'cat-income', name: 'Gelir', type: 'INCOME' },
  { id: 'cat-housing', name: 'Konut', type: 'EXPENSE' },
  { id: 'cat-food', name: 'Gıda', type: 'EXPENSE' },
  { id: 'cat-bills', name: 'Fatura', type: 'EXPENSE' },
  { id: 'cat-transport', name: 'Ulaşım', type: 'EXPENSE' },
  { id: 'cat-health', name: 'Sağlık', type: 'EXPENSE' },
  { id: 'cat-personal', name: 'Kişisel', type: 'EXPENSE' },
  { id: 'cat-other', name: 'Diğer', type: 'EXPENSE' },
];

/* Tarihler çalıştırıldığı aya göre üretiliyor. Sabit tarih yazsaydım demo
   birkaç ay sonra "geçen seneki kayıtlar" gibi görünürdü ve ay filtresi boş
   dönerdi. */
const gun = (aylarOnce, gunNo) => {
  const d = new Date();
  d.setMonth(d.getMonth() - aylarOnce, gunNo);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const kayit = (id, aylarOnce, gunNo, type, categoryId, amount, comment) => ({
  id,
  transactionDate: gun(aylarOnce, gunNo),
  type,
  categoryId,
  comment,
  amount: type === 'INCOME' ? Math.abs(amount) : -Math.abs(amount),
  balanceAfter: 0,
  userId: DEMO_USER.id,
});

export const DEMO_TRANSACTIONS = [
  // Bu ay
  kayit('t-01', 0, 3, 'INCOME', 'cat-income', 42500, 'Maaş'),
  kayit('t-02', 0, 5, 'EXPENSE', 'cat-housing', 18000, 'Kira'),
  kayit('t-03', 0, 6, 'EXPENSE', 'cat-bills', 1485, 'Elektrik'),
  kayit('t-04', 0, 9, 'EXPENSE', 'cat-food', 3240, 'Market'),
  kayit('t-05', 0, 11, 'EXPENSE', 'cat-transport', 1120, 'Ulaşım kartı'),
  kayit('t-06', 0, 14, 'INCOME', 'cat-income', 9750, 'Serbest çalışma'),
  kayit('t-07', 0, 16, 'EXPENSE', 'cat-food', 2180, 'Market'),
  kayit('t-08', 0, 18, 'EXPENSE', 'cat-health', 2450, 'Diş hekimi'),
  kayit('t-09', 0, 21, 'EXPENSE', 'cat-personal', 640, 'Kitap'),
  kayit('t-10', 0, 23, 'EXPENSE', 'cat-bills', 890, 'İnternet'),
  kayit('t-11', 0, 26, 'EXPENSE', 'cat-other', 1350, 'Hediye'),

  // Geçen ay — dönem karşılaştırması boş kalmasın
  kayit('t-12', 1, 3, 'INCOME', 'cat-income', 42500, 'Maaş'),
  kayit('t-13', 1, 5, 'EXPENSE', 'cat-housing', 18000, 'Kira'),
  kayit('t-14', 1, 8, 'EXPENSE', 'cat-food', 3890, 'Market'),
  kayit('t-15', 1, 12, 'EXPENSE', 'cat-bills', 1610, 'Elektrik'),
  kayit('t-16', 1, 15, 'EXPENSE', 'cat-transport', 1120, 'Ulaşım kartı'),
  kayit('t-17', 1, 19, 'EXPENSE', 'cat-personal', 2300, 'Ayakkabı'),
  kayit('t-18', 1, 24, 'EXPENSE', 'cat-other', 780, 'Kırtasiye'),

  // İki ay önce
  kayit('t-19', 2, 3, 'INCOME', 'cat-income', 41000, 'Maaş'),
  kayit('t-20', 2, 5, 'EXPENSE', 'cat-housing', 17500, 'Kira'),
  kayit('t-21', 2, 10, 'EXPENSE', 'cat-food', 3410, 'Market'),
  kayit('t-22', 2, 17, 'EXPENSE', 'cat-health', 1200, 'Eczane'),
  kayit('t-23', 2, 22, 'EXPENSE', 'cat-bills', 1520, 'Elektrik'),
];

/** Bakiye kayıtlardan hesaplanır; ayrı tutulup senkronsuz kalmasın. */
export const hesaplaBakiye = (islemler) =>
  islemler.reduce((toplam, t) => toplam + Number(t.amount || 0), 0);
