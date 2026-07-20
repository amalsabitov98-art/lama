/* ==========================================================================
   Turon Tour — калькулятор быстрого запроса на трансфер
   Тарифы ориентировочные, за место в минивэне по маршруту Батуми ⇄ Ризе.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("quoteForm");
  if (!form) return;

  var direction = document.getElementById("qDirection");
  var pax = document.getElementById("qPax");
  var dateInput = document.getElementById("qDate");
  var valueEl = document.getElementById("quoteValue");

  // Базовая ставка за одного пассажира, USD
  var BASE = { "bt-rz": 35, "rz-bt": 35, "round": 60 };

  var fmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

  function seasonMultiplier(dateStr) {
    if (!dateStr) return 1;
    var month = new Date(dateStr).getMonth() + 1; // 1..12
    // Высокий сезон июнь–сентябрь
    if (month >= 6 && month <= 9) return 1.2;
    // Низкий сезон ноябрь–февраль
    if (month >= 11 || month <= 2) return 0.9;
    return 1;
  }

  function groupDiscount(n) {
    if (n >= 8) return 0.85;
    if (n >= 4) return 0.92;
    return 1;
  }

  function recalc() {
    var n = Math.max(1, parseInt(pax.value, 10) || 1);
    var base = BASE[direction.value] || 35;
    var total = base * n * seasonMultiplier(dateInput.value) * groupDiscount(n);
    valueEl.textContent = "$" + fmt.format(Math.round(total));
  }

  // Минимальная дата — сегодня
  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  [direction, pax, dateInput].forEach(function (el) {
    if (el) el.addEventListener("input", recalc);
  });
  recalc();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = [
      "Здравствуйте! Хочу уточнить трансфер Turon Tour.",
      "Направление: " + direction.options[direction.selectedIndex].text,
      "Дата: " + (dateInput.value || "не выбрана"),
      "Пассажиров: " + pax.value,
      "Расчёт на сайте: " + valueEl.textContent
    ].join("\n");
    var wa = "https://wa.me/995555000111?text=" + encodeURIComponent(msg);
    window.open(wa, "_blank", "noopener");
  });
})();
