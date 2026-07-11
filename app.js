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
  map.panTo({ lat, lng });
  map.setZoom(15);
  openInfo({ lat, lng }, title);
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

// ---------- Map (Google Maps) ----------

let map, infoWindow;
let mapMarkers = [];
let mapLines = [];
const dayColors = {};
const palette = ["#b8452e", "#2c6b6b", "#ab8226", "#6b4e9a", "#3a7d3a", "#c05a8c", "#4a6fa5", "#a25d2e", "#5b7d7d"];

// Google Maps 載入完成後自動呼叫（見 index.html 底部的 script callback）
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.9, lng: 136.95 },
    zoom: 8,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    gestureHandling: "cooperative"
  });
  infoWindow = new google.maps.InfoWindow();

  TRIP.days.forEach((d, i) => { dayColors[d.id] = palette[i % palette.length]; });

  showAllMode();
}
window.initMap = initMap;

function clearMap() {
  mapMarkers.forEach(m => m.setMap(null));
  mapLines.forEach(l => l.setMap(null));
  mapMarkers = [];
  mapLines = [];
}

function openInfo(position, html) {
  infoWindow.setContent(`<div class="gm-pop">${html}</div>`);
  infoWindow.setPosition(position);
  infoWindow.open(map);
}

// 總覽用的小圓點
function dotIcon(color) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#ffffff",
    strokeWeight: 1.5
  };
}

// 編號圖釘：sight＝實心 / transit＝空心 / hotel＝深色
function pinIcon(color, variant) {
  if (variant === "hotel") {
    return { path: google.maps.SymbolPath.CIRCLE, scale: 11, fillColor: "#1c2b46", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 };
  }
  const filled = variant !== "transit";
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 11,
    fillColor: filled ? color : "#ffffff",
    fillOpacity: 1,
    strokeColor: color,
    strokeWeight: 2.5
  };
}

function pinLabel(text, color, variant) {
  const lightText = variant !== "transit"; // 實心/hotel 白字，空心用當天色
  return { text: text, color: lightText ? "#ffffff" : color, fontFamily: "monospace", fontSize: "12px", fontWeight: "700" };
}

// 虛線（Google Maps 用符號堆疊模擬 dash）
function dashedLine(path, color, opacity) {
  const dash = { path: "M 0,-1 0,1", strokeOpacity: opacity, strokeColor: color, strokeWeight: 2.5, scale: 2.5 };
  return new google.maps.Polyline({
    path: path,
    map: map,
    strokeOpacity: 0,
    icons: [{ icon: dash, offset: "0", repeat: "13px" }]
  });
}

function fitTo(bounds, maxZoom) {
  map.fitBounds(bounds, 30);
  google.maps.event.addListenerOnce(map, "idle", () => {
    if (maxZoom && map.getZoom() > maxZoom) map.setZoom(maxZoom);
  });
}

// 「全部」總覽：每天不同顏色的圓點＋當天路線
function drawAllMarkers() {
  if (!map) return;
  clearMap();
  const bounds = new google.maps.LatLngBounds();

  TRIP.days.forEach(day => {
    const color = dayColors[day.id];
    const points = day.timeline.filter(p => p.lat && p.lng).slice();
    if (day.hotel && day.hotel.lat) points.push({ lat: day.hotel.lat, lng: day.hotel.lng, title: "🏨 " + day.hotel.name });

    const path = [];
    points.forEach(p => {
      const pos = { lat: p.lat, lng: p.lng };
      const marker = new google.maps.Marker({ position: pos, map: map, icon: dotIcon(color), title: p.title });
      marker.addListener("click", () => openInfo(pos, `<b>${day.seal} ${day.dateLabel}</b><br>${p.title}`));
      mapMarkers.push(marker);
      path.push(pos);
      bounds.extend(pos);
    });
    if (path.length > 1) mapLines.push(dashedLine(path, color, 0.5));
  });

  if (!bounds.isEmpty()) fitTo(bounds, 11);
}

// 「單日」：編號圖釘（1＝出發點）＋當天路線
function filterMapByDay(dayId) {
  if (!map) return;
  clearMap();
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

  const bounds = new google.maps.LatLngBounds();
  const path = [];
  let n = 0;
  points.forEach(p => {
    const pos = { lat: p.lat, lng: p.lng };
    const label = p.variant === "hotel" ? "宿" : String(++n);
    const prefix = p.variant === "hotel" ? "🏨 " : label + ". ";
    const marker = new google.maps.Marker({
      position: pos, map: map,
      icon: pinIcon(color, p.variant),
      label: pinLabel(label, color, p.variant),
      title: p.title
    });
    marker.addListener("click", () => openInfo(pos, `<b>${day.seal} ${day.dateLabel}</b><br>${prefix}${p.title}${p.note ? "<br>" + p.note : ""}`));
    mapMarkers.push(marker);
    path.push(pos);
    bounds.extend(pos);
  });

  if (path.length > 1) mapLines.push(dashedLine(path, color, 0.6));
  if (!bounds.isEmpty()) fitTo(bounds, 14);
}

// ---------- Init ----------

renderHero();
renderDayNav();
renderDays();
// initMap 由 Google Maps 載入完成後透過 callback 自動呼叫（見 index.html 底部）；
// 地圖建立後會自動進入「全部」總覽

// 記下日期列高度，單日模式時地圖才能精準黏在它正下方（換行/轉向時重算）
const navEl = document.getElementById("dayNav");
function updateNavHeight() {
  document.documentElement.style.setProperty("--nav-h", navEl.offsetHeight + "px");
}
updateNavHeight();
window.addEventListener("resize", updateNavHeight);
