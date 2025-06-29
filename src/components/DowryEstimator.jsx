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

  const items = Object.keys(priceData.ideal);

  const total = items.reduce((sum, item) => sum + priceData[level][item], 0);

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

      <table>
        <thead>
          <tr>
            <th>کالا</th>
            <th>قیمت (میلیون تومان)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr>
              <td>{item}</td>
              <td>{priceData[level][item]}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>مجموع</td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={() => window.print()}>چاپ</button>
    </div>
  );
}
