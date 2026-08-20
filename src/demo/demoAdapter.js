import {
  DEMO_USER,
  DEMO_TOKEN,
  DEMO_CATEGORIES,
  DEMO_TRANSACTIONS,
  hesaplaBakiye,
} from './demoData';

/**
 * Demo kipi için axios adaptörü.
 *
 * Kesme noktası olarak axios seçildi çünkü alternatifi her thunk'a, her
 * reducer'a ve her bileşene "demo mu?" kontrolü serpiştirmekti. Adaptör
 * katmanında uygulamanın geri kalanı hiçbir şey bilmiyor: istek çıkıyor,
 * cevap dönüyor, tek fark cevabın ağdan değil bellekten gelmesi.
 */

const DEMO_ANAHTAR = 'mg_demo';

export const demoAcik = () => {
  try {
    return localStorage.getItem(DEMO_ANAHTAR) === '1';
  } catch {
    return false;
  }
};

export const demoBaslat = () => localStorage.setItem(DEMO_ANAHTAR, '1');
export const demoBitir = () => localStorage.removeItem(DEMO_ANAHTAR);

/* Oturum boyu yaşayan kopya. Ekleme ve silme buraya yazılır, yani demo
   gerçekten çalışır — sayfa yenilenince başa döner, ki bir demonun
   istenen davranışı da budur. */
let islemler = [...DEMO_TRANSACTIONS];
let sonrakiId = 1000;

const yanit = (config, data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
  request: {},
});

const yol = (url = '') => url.replace(/^.*\/api/, '').split('?')[0] || '/';

/* Gerçek bir ağ isteği asla anında dönmez. Küçük bir gecikme bırakmak,
   yükleniyor durumlarının demo kipinde de görünmesini sağlıyor — aksi halde
   iskelet ekranlar hiç çizilmez ve demo, uygulamanın gerçek davranışını
   yanlış gösterir. */
const gecikme = (ms = 180) => new Promise((r) => setTimeout(r, ms));

export async function demoAdapter(config) {
  const method = (config.method || 'get').toLowerCase();
  const p = yol(config.url);
  await gecikme();

  if (p === '/auth/sign-in' || p === '/auth/sign-up') {
    return yanit(config, {
      token: DEMO_TOKEN,
      user: { ...DEMO_USER, balance: hesaplaBakiye(islemler) },
    });
  }

  if (p === '/auth/sign-out') {
    islemler = [...DEMO_TRANSACTIONS];
    return yanit(config, {}, 204);
  }

  if (p === '/users/current') {
    return yanit(config, { ...DEMO_USER, balance: hesaplaBakiye(islemler) });
  }

  if (p === '/transaction-categories') {
    return yanit(config, DEMO_CATEGORIES);
  }

  if (p === '/transactions' && method === 'get') {
    const sirali = [...islemler].sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );
    return yanit(config, sirali);
  }

  if (p === '/transactions' && method === 'post') {
    const gelen = JSON.parse(config.data || '{}');
    const tutar = Math.abs(Number(gelen.amount) || 0);
    const yeni = {
      ...gelen,
      id: `t-demo-${sonrakiId++}`,
      amount: gelen.type === 'INCOME' ? tutar : -tutar,
      userId: DEMO_USER.id,
    };
    islemler = [yeni, ...islemler];
    return yanit(config, yeni, 201);
  }

  const tekil = p.match(/^\/transactions\/(.+)$/);
  if (tekil) {
    const id = tekil[1];
    if (method === 'patch' || method === 'put') {
      const gelen = JSON.parse(config.data || '{}');
      let guncel = null;
      islemler = islemler.map((t) => {
        if (t.id !== id) return t;
        const tip = gelen.type || t.type;
        const tutar = Math.abs(Number(gelen.amount ?? t.amount) || 0);
        guncel = { ...t, ...gelen, type: tip, amount: tip === 'INCOME' ? tutar : -tutar };
        return guncel;
      });
      if (!guncel) return Promise.reject(hata(config, 404, 'Kayıt bulunamadı'));
      return yanit(config, guncel);
    }
    if (method === 'delete') {
      const vardi = islemler.some((t) => t.id === id);
      islemler = islemler.filter((t) => t.id !== id);
      if (!vardi) return Promise.reject(hata(config, 404, 'Kayıt bulunamadı'));
      return yanit(config, {}, 204);
    }
  }

  /* Kapsanmayan bir uç nokta sessizce boş dönmemeli: demo kipinde bir ekran
     çalışmıyorsa bunu görmek isteriz. */
  return Promise.reject(hata(config, 404, `Demo kipinde tanımsız uç nokta: ${method.toUpperCase()} ${p}`));
}

function hata(config, status, message) {
  const e = new Error(message);
  e.config = config;
  e.response = { status, data: { message }, config, headers: {} };
  e.isAxiosError = true;
  return e;
}

/** Demo açıkken verilen axios örneğini bellek adaptörüne bağlar. */
export function demoyaBagla(instance) {
  instance.interceptors.request.use((config) => {
    if (demoAcik()) config.adapter = demoAdapter;
    return config;
  });
  return instance;
}
