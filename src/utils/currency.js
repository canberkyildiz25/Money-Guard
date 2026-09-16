/**
 * Tek para birimi biçimlendiricisi.
 *
 * Uygulama Türk lirası tutuyor ama ekranda euro işareti basıyordu ve sayıları
 * `toLocaleString("en-IN")` ile — yani Hindistan lakh/crore gruplamasıyla —
 * biçimlendiriyordu. 1.250.000 ₺ orada "12,50,000" olarak çıkar. Bu bir stil
 * tercihi değil, yanlış sayı gösterimi.
 *
 * Tutarlar `tabular-nums` ile dizildiği için basamak sayısı sabit tutuluyor:
 * bir sütunda kuruşlu ve kuruşsuz satırlar karışırsa hizalama bozulur.
 */
const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export const formatTRY = (value) => formatter.format(Number(value) || 0);

/** Kuruşun okuyucuya bir şey söylemediği yerlerde — grafik etiketi, özet. */
export const formatTRYCompact = (value) => compactFormatter.format(Number(value) || 0);

export default formatTRY;

/**
 * Tarih: GG.AA.YYYY. Tabloda ISO biçimi (2026-09-16) duruyordu; Türkçe
 * arayüzde okunuşu ters ve alışılmadık.
 *
 * Tarih dizesi saat dilimine göre kaymasın diye parçalara ayrılıp yerel
 * olarak kuruluyor — `new Date('2026-09-16')` UTC gece yarısı sayılır ve
 * UTC'nin gerisindeki bir saat diliminde bir gün önceyi gösterir.
 */
export const formatDateTR = (value) => {
  if (!value) return '';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
