import { useState } from 'preact/hooks';

const priceData = {
  ideal: {
    "یخچال": 200,
    "فرش": 120,
    "مبل": 300,
    "تلویزیون": 60,
    "جاروبرقی": 30,
    "ماشین ظرف‌شویی": 80,
    "ماشین لباس‌شویی": 80,
    "قهوه‌ساز": 50,
    "مایکروفر": 30,
    "هود": 15,
    "سرویس قابلمه": 120,
    "سرویس چوب": 400,
    "میز": 500,
    "میز مطالعه": 1500,
  },
  moderate: {
    "یخچال": 120,
    "فرش": 90,
    "مبل": 150,
    "تلویزیون": 40,
    "جاروبرقی": 15,
    "ماشین ظرف‌شویی": 50,
    "ماشین لباس‌شویی": 45,
    "قهوه‌ساز": 30,
    "مایکروفر": 20,
    "هود": 10,
    "سرویس قابلمه": 85,
    "سرویس چوب": 250,
    "میز": 400,
    "میز مطالعه": 1000,
  },
  essential: {
    "یخچال": 70,
    "فرش": 60,
    "مبل": 80,
    "تلویزیون": 25,
    "جاروبرقی": 8,
    "ماشین ظرف‌شویی": 30,
    "ماشین لباس‌شویی": 20,
    "قهوه‌ساز": 15,
    "مایکروفر": 8,
    "هود": 6,
    "سرویس قابلمه": 60,
    "سرویس چوب": 100,
    "میز": 250,
    "میز مطالعه": 600,
  },
};

const labels = {
  ideal: "ایدئال",
  moderate: "معقولی",
  essential: "ضروری",
};

export default function DowryEstimator() {
  const [level, setLevel] = useState('essential');
  const [digikalaPrices, setDigikalaPrices] = useState({});
  const [loading, setLoading] = useState(false);

  const items = Object.keys(priceData.ideal);

  const total = items.reduce((sum, item) => sum + priceData[level][item], 0);
  const digiTotal = items.reduce(
    (sum, item) => sum + (typeof digikalaPrices[item] === 'number' ? digikalaPrices[item] : 0),
    0,
  );

  async function loadFromDigikala() {
    setLoading(true);
    const fetchPrice = async (name) => {
      try {
        const res = await fetch(
          `https://api.digikala.com/v1/search/?q=${encodeURIComponent(name)}`,
        );
        const data = await res.json();
        const product = data?.data?.products?.[0];
        const price = product?.default_variant?.price?.selling_price;
        return price ? Math.round(price / 1_000_000) : null;
      } catch (err) {
        console.error('digikala fetch', err);
        return null;
      }
    };

    const entries = await Promise.all(
      items.map(async (item) => [item, await fetchPrice(item)]),
    );
    setDigikalaPrices(Object.fromEntries(entries));
    setLoading(false);
  }

  return (
    <div class="dowry-estimator">
      <label for="level-select">سطح جهیزیه:</label>
      <select
        id="level-select"
        value={level}
        onInput={(e) => setLevel(e.target.value)}
      >
        {Object.keys(labels).map((key) => (
          <option value={key}>{labels[key]}</option>
        ))}
      </select>

      <button disabled={loading} onClick={loadFromDigikala}>
        {loading ? 'در حال بارگذاری…' : 'خواندن قیمت‌ها از دیجی‌کالا'}
      </button>

      <table>
        <thead>
          <tr>
            <th>کالا</th>
            <th>قیمت (میلیون تومان)</th>
            <th>قیمت دیجی‌کالا</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr>
              <td>{item}</td>
              <td>{priceData[level][item]}</td>
              <td>{digikalaPrices[item] ?? '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>مجموع</td>
            <td>{total}</td>
            <td>{digiTotal || '-'}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={() => window.print()}>چاپ</button>
    </div>
  );
}
