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

// 交通類項目（在地圖上用「空心圖釘」跟景點的實心圖釘區分）
const TRANSIT_KINDS = new Set(["transport", "ferry"]);

// 產生 Google Maps 連結（免金鑰，點了會跳到手機的 Google Maps app）
function gmapUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function renderHero() {
  document.getElementById("heroTitle").textContent = TRIP.title;
  document.getElementById("heroDates").textContent = TRIP.dateRange;
}

function renderDayNav() {
  const nav = document.getElementById("dayNav");

  // 最前面的「全部」＝顯示所有天數的總覽（預設畫面）
  const allBtn = document.createElement("button");
  allBtn.className = "daynav__item daynav__item--all is-active";
  allBtn.textContent = "全部";
  allBtn.dataset.dayId = "all";
  allBtn.addEventListener("click", () => showAllMode());
  nav.appendChild(allBtn);

  TRIP.days.forEach(day => {
    const btn = document.createElement("button");
    btn.className = "daynav__item";
    btn.textContent = day.seal;
    btn.dataset.dayId = day.id;
    btn.addEventListener("click", () => showDayMode(day.id));
    nav.appendChild(btn);
  });
}

function setActiveNav(dayId) {
  document.querySelectorAll(".daynav__item").forEach(el => {
    el.classList.toggle("is-active", el.dataset.dayId === dayId);
  });
}

// 「全部」檢視：顯示所有天數的卡片與整趟路線
function showAllMode() {
  document.body.classList.remove("day-mode");
  setActiveNav("all");
  document.querySelectorAll(".day").forEach(el => { el.style.display = ""; });
  drawAllMarkers();
}

// 「單日」檢視：地圖黏在上方，底下只留當天行程，只畫當天景點
function showDayMode(dayId) {
  document.body.classList.add("day-mode");
  setActiveNav(dayId);
  document.querySelectorAll(".day").forEach(el => {
    const show = el.id === dayId;
    el.style.display = show ? "" : "none";
    el.classList.toggle("is-open", show);
    el.querySelector(".day__header").setAttribute("aria-expanded", show);
  });
  filterMapByDay(dayId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 點行程裡的景點時，地圖移動並放大到該點
function focusMapPoint(lat, lng, title) {
  if (!map) return;
  map.setView([lat, lng], 14, { animate: true });
  L.popup({ offset: [0, -4] }).setLatLng([lat, lng]).setContent(title).openOn(map);
}

function renderDays() {
  const container = document.getElementById("days");
  TRIP.days.forEach((day, i) => {
    const el = document.createElement("article");
    el.className = "day" + (i === 0 ? " is-open" : "");
    el.id = day.id;

    let timelineHtml = day.timeline.map(item => {
      const hasGeo = item.lat && item.lng;
      const clickable = hasGeo;
      const geoAttr = clickable ? ` data-lat="${item.lat}" data-lng="${item.lng}"` : "";
      const gmapLink = hasGeo
        ? `<a class="tl-gmap" href="${gmapUrl(item.lat, item.lng)}" target="_blank" rel="noopener">在 Google Maps 開啟 ↗</a>`
        : "";
      return `
      <div class="tl-item${clickable ? " tl-item--geo" : ""}" data-kind="${item.kind}"${geoAttr}>
        ${item.time ? `<div class="tl-time">${item.time}</div>` : ""}
        <div class="tl-title"><span class="tl-icon">${ICONS[item.kind] || "📍"}</span>${item.title}</div>
        ${item.note ? `<div class="tl-note">${item.note}</div>` : ""}
        ${gmapLink}
      </div>`;
    }).join("");

    let alertHtml = day.alert ? `<div class="alert">⚠️ ${day.alert}</div>` : "";

    let hotelHtml = day.hotel ? `
      <div class="hotel">
        <div class="hotel__icon">🏨</div>
        <div class="hotel__body">
          <div class="hotel__name">${day.hotel.name}</div>
          ${day.hotel.note ? `<div class="hotel__note">${day.hotel.note}</div>` : ""}
          ${day.hotel.lat ? `<a class="hotel__gmap" href="${gmapUrl(day.hotel.lat, day.hotel.lng)}" target="_blank" rel="noopener">在 Google Maps 開啟 ↗</a>` : ""}
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
    });

    // 點景點 → 地圖移動過去（點 Google Maps 連結則不觸發）
    el.querySelectorAll(".tl-item--geo").forEach(it => {
      it.addEventListener("click", e => {
        if (e.target.closest(".tl-gmap")) return;
        focusMapPoint(
          parseFloat(it.dataset.lat),
          parseFloat(it.dataset.lng),
          it.querySelector(".tl-title").textContent
        );
      });
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

// 產生「編號圖釘」：
//   sight   ＝實心（景點）  transit＝空心（交通）  hotel＝深色 🏨
// 序號 1,2,3… 依當天行程順序，1＝當天出發點
function routeIcon(label, color, variant) {
  let cls = "route-pin__badge";
  let style = `background:${color}`;
  if (variant === "hotel") {
    cls += " route-pin__badge--hotel";
    style = "";
  } else if (variant === "transit") {
    cls += " route-pin__badge--transit";
    style = `color:${color};border-color:${color}`;
  }
  return L.divIcon({
    className: "route-pin",
    html: `<div class="${cls}" style="${style}">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

function filterMapByDay(dayId) {
  markerLayer.clearLayers();
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;

  const color = dayColors[day.id];
  const points = day.timeline
    .filter(p => p.lat && p.lng)
    .map(p => ({
      lat: p.lat, lng: p.lng, title: p.title, note: p.note,
      variant: TRANSIT_KINDS.has(p.kind) ? "transit" : "sight"
    }));
  if (day.hotel && day.hotel.lat) {
    points.push({ lat: day.hotel.lat, lng: day.hotel.lng, title: day.hotel.name, note: day.hotel.note, variant: "hotel" });
  }

  const latlngs = [];
  let n = 0;
  points.forEach(p => {
    const label = p.variant === "hotel" ? "🏨" : String(++n);
    const prefix = p.variant === "hotel" ? "🏨 " : label + ". ";
    L.marker([p.lat, p.lng], { icon: routeIcon(label, color, p.variant) })
      .bindPopup(`<b>${day.seal} ${day.dateLabel}</b><br>${prefix}${p.title}${p.note ? "<br>" + p.note : ""}`)
      .addTo(markerLayer);
    latlngs.push([p.lat, p.lng]);
  });

  if (latlngs.length > 1) {
    L.polyline(latlngs, { color: color, weight: 2.5, opacity: 0.5, dashArray: "4,7" }).addTo(markerLayer);
  }
  if (latlngs.length) map.fitBounds(latlngs, { padding: [36, 36], maxZoom: 14 });
}

// ---------- Init ----------

renderHero();
renderDayNav();
renderDays();
initMap();

// 記下日期列高度，單日模式時地圖才能精準黏在它正下方（換行/轉向時重算）
const navEl = document.getElementById("dayNav");
function updateNavHeight() {
  document.documentElement.style.setProperty("--nav-h", navEl.offsetHeight + "px");
}
updateNavHeight();
window.addEventListener("resize", updateNavHeight);

// 預設進入「全部」總覽
showAllMode();
