/* ==========================================================================
   Turon Tour — рендер каталога туров из data/tours.json
   Даёт fallback, если файл открыт по file:// и fetch недоступен.
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("toursGrid");
  var loading = document.getElementById("toursLoading");
  if (!grid) return;

  var fmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function tourCard(t) {
    var accent = ["sea", "coral", "tea"].indexOf(t.accent) >= 0 ? t.accent : "sea";
    var chips = (t.includes || []).map(function (i) {
      return '<li>' + escapeHtml(i) + '</li>';
    }).join("");
    return (
      '<article class="tour-card tour-card--' + accent + '">' +
        '<div class="tour-card__top">' +
          (t.badge ? '<span class="tour-card__badge">' + escapeHtml(t.badge) + '</span>' : '') +
          '<div class="tour-card__meta">' +
            '<span>⏱ ' + escapeHtml(t.duration) + '</span>' +
            '<span>👥 ' + escapeHtml(t.group) + '</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="tour-card__title">' + escapeHtml(t.title) + '</h3>' +
        '<p class="tour-card__summary">' + escapeHtml(t.summary) + '</p>' +
        '<ul class="tour-card__includes">' + chips + '</ul>' +
        '<div class="tour-card__foot">' +
          '<div class="tour-card__price">' +
            '<strong>$' + fmt.format(t.price) + '</strong>' +
            '<span>' + escapeHtml(t.priceNote || '') + '</span>' +
          '</div>' +
          '<a class="btn btn--primary" href="#booking" data-tour="' + escapeHtml(t.id) + '">Выбрать</a>' +
        '</div>' +
      '</article>'
    );
  }

  function render(tours) {
    grid.innerHTML = tours.map(tourCard).join("");
    grid.querySelectorAll("[data-tour]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var select = document.getElementById("bookTour");
        if (select) select.value = btn.getAttribute("data-tour");
      });
    });
  }

  fetch("data/tours.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) { render(data.tours || []); })
    .catch(function () {
      if (loading) {
        loading.textContent = "Свяжитесь с нами — подберём тур под ваши даты.";
      }
    });
})();
