/* ==========================================================================
   Turon Tour — обработка формы бронирования
   Собирает заявку, валидирует и открывает WhatsApp с готовым сообщением.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("bookingForm");
  if (!form) return;

  var status = document.getElementById("bookStatus");
  var dateInput = document.getElementById("bookDate");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  var TOUR_LABELS = {
    "transfer-direct": "Прямой трансфер Батуми → Ризе",
    "tea-hills": "Чайные холмы Ризе",
    "waterfalls-firtina": "Долина Фыртына и водопады",
    "round-trip": "Батуми ⇄ Ризе, туда-обратно",
    "shopping": "Шопинг-тур в Ризе",
    "family": "Семейный день у моря"
  };

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "booking-form__status" + (kind ? " is-" + kind : "");
  }

  function validPhone(v) {
    var digits = v.replace(/\D/g, "");
    return digits.length >= 9;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var tour = form.tour.value;
    var date = form.date.value;
    var comment = form.comment.value.trim();

    if (name.length < 2) { setStatus("Пожалуйста, укажите имя.", "error"); form.name.focus(); return; }
    if (!validPhone(phone)) { setStatus("Проверьте номер телефона.", "error"); form.phone.focus(); return; }
    if (!date) { setStatus("Выберите дату поездки.", "error"); form.date.focus(); return; }

    var message = [
      "🌊 Заявка с сайта Turon Tour",
      "Имя: " + name,
      "Телефон: " + phone,
      "Тур: " + (TOUR_LABELS[tour] || tour),
      "Дата: " + date,
      comment ? "Комментарий: " + comment : null
    ].filter(Boolean).join("\n");

    // Сохраняем черновик локально на случай, если гость вернётся
    try { localStorage.setItem("turon_last_request", JSON.stringify({ name: name, phone: phone, tour: tour, date: date })); } catch (_) {}

    setStatus("Открываем WhatsApp — отправьте готовое сообщение ✅", "ok");
    var wa = "https://wa.me/995555000111?text=" + encodeURIComponent(message);
    window.open(wa, "_blank", "noopener");
    form.reset();
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });

  // Восстанавливаем имя/телефон из прошлой заявки
  try {
    var saved = JSON.parse(localStorage.getItem("turon_last_request") || "null");
    if (saved) {
      if (saved.name) form.name.value = saved.name;
      if (saved.phone) form.phone.value = saved.phone;
    }
  } catch (_) {}
})();
