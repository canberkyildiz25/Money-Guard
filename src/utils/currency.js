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
