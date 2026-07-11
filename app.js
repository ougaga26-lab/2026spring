// ============================================================
// 主程式：讀取 data.js 的 TRIP 資料，畫出頁面內容跟地圖
// 一般不需要修改這個檔案，除非要調整互動邏輯
// ============================================================

const ICONS = {
  transport: "🚃",
  food: "🍽️",
  sight: "⛩️",
  sunrise: "🌅",
  ferry: "⛴️",
  onsen: "♨️",
  note: "📍"
};

function renderHero() {
  document.getElementById("heroTitle").textContent = TRIP.title;
  document.getElementById("heroDates").textContent = TRIP.dateRange;
}

function renderDayNav() {
  const nav = document.getElementById("dayNav");
  TRIP.days.forEach((day, i) => {
    const btn = document.createElement("button");
    btn.className = "daynav__item" + (i === 0 ? " is-active" : "");
    btn.textContent = day.seal;
    btn.dataset.dayId = day.id;
    btn.addEventListener("click", () => {
      setActiveNav(day.id);
      filterMapByDay(day.id);
    });
    nav.appendChild(btn);
  });
}

function setActiveNav(dayId) {
  document.querySelectorAll(".daynav__item").forEach(el => {
    el.classList.toggle("is-active", el.dataset.dayId === dayId);
  });
}

function renderDays() {
  const container = document.getElementById("days");
  TRIP.days.forEach((day, i) => {
    const el = document.createElement("article");
    el.className = "day" + (i === 0 ? " is-open" : "");
    el.id = day.id;

    let timelineHtml = day.timeline.map(item => `
      <div class="tl-item" data-kind="${item.kind}">
        ${item.time ? `<div class="tl-time">${item.time}</div>` : ""}
        <div class="tl-title"><span class="tl-icon">${ICONS[item.kind] || "📍"}</span>${item.title}</div>
        ${item.note ? `<div class="tl-note">${item.note}</div>` : ""}
      </div>
    `).join("");

    let alertHtml = day.alert ? `<div class="alert">⚠️ ${day.alert}</div>` : "";

    let hotelHtml = day.hotel ? `
      <div class="hotel">
        <div class="hotel__icon">🏨</div>
        <div>
          <div class="hotel__name">${day.hotel.name}</div>
          ${day.hotel.note ? `<div class="hotel__note">${day.hotel.note}</div>` : ""}
        </div>
      </div>
    ` : "";

    el.innerHTML = `
      <button class="day__header" aria-expanded="${i === 0}">
        <div class="day__seal">${day.seal}</div>
        <div class="day__heading">
          <div class="day__date">${day.dateLabel}</div>
          <div class="day__title">${day.title}</div>
        </div>
        <svg class="day__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="day__body">
        <div class="day__timeline">${timelineHtml}</div>
        ${alertHtml}
        ${hotelHtml}
      </div>
    `;

    el.querySelector(".day__header").addEventListener("click", () => {
      const willOpen = !el.classList.contains("is-open");
      el.classList.toggle("is-open");
      el.querySelector(".day__header").setAttribute("aria-expanded", willOpen);
      setActiveNav(day.id);
      filterMapByDay(day.id);
    });

    container.appendChild(el);
  });
}

// ---------- Map ----------

let map, markerLayer;
const dayColors = {};
const palette = ["#b8452e", "#2c6b6b", "#ab8226", "#6b4e9a", "#3a7d3a", "#c05a8c", "#4a6fa5", "#a25d2e", "#5b7d7d"];

function initMap() {
  map = L.map("map", { scrollWheelZoom: false }).setView([34.9, 136.95], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  TRIP.days.forEach((d, i) => { dayColors[d.id] = palette[i % palette.length]; });

  drawAllMarkers();
}

function drawAllMarkers() {
  markerLayer.clearLayers();
  const bounds = [];

  TRIP.days.forEach(day => {
    const color = dayColors[day.id];
    const points = day.timeline.filter(p => p.lat && p.lng);
    if (day.hotel && day.hotel.lat) points.push({ ...day.hotel, title: "🏨 " + day.hotel.name, note: day.hotel.note });

    const latlngs = [];
    points.forEach(p => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 7,
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.85
      }).bindPopup(`<b>${day.seal} ${day.dateLabel}</b><br>${p.title}`);
      marker.addTo(markerLayer);
      latlngs.push([p.lat, p.lng]);
      bounds.push([p.lat, p.lng]);
    });

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: color, weight: 2.5, opacity: 0.55, dashArray: "5,6" }).addTo(markerLayer);
    }
  });

  if (bounds.length) map.fitBounds(bounds, { padding: [20, 20] });
}

function filterMapByDay(dayId) {
  markerLayer.clearLayers();
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;

  const color = dayColors[day.id];
  const points = day.timeline.filter(p => p.lat && p.lng);
  if (day.hotel && day.hotel.lat) points.push({ ...day.hotel, title: "🏨 " + day.hotel.name, note: day.hotel.note });

  const latlngs = [];
  points.forEach(p => {
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 8,
      color: color,
      weight: 2.5,
      fillColor: color,
      fillOpacity: 0.9
    }).bindPopup(`<b>${day.seal} ${day.dateLabel}</b><br>${p.title}${p.note ? "<br>" + p.note : ""}`);
    marker.addTo(markerLayer);
    latlngs.push([p.lat, p.lng]);
  });

  if (latlngs.length > 1) {
    L.polyline(latlngs, { color: color, weight: 3, opacity: 0.7, dashArray: "5,6" }).addTo(markerLayer);
  }
  if (latlngs.length) map.fitBounds(latlngs, { padding: [30, 30], maxZoom: 13 });
}

document.getElementById("showAllBtn").addEventListener("click", () => {
  drawAllMarkers();
  setActiveNav(null);
});

// ---------- Init ----------

renderHero();
renderDayNav();
renderDays();
initMap();
