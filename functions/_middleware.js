// ============================================================
// Cloudflare Pages Functions — 自訂密碼登入頁（只要密碼，無使用者名稱）
// ------------------------------------------------------------
// 未登入 → 顯示一頁自訂的密碼頁（手帳風格）；輸入正確密碼後寫入 cookie 放行。
// 密碼設定在 Cloudflare Pages 環境變數 SITE_PASSWORD，不寫在程式碼裡。
// ※ 只在 Cloudflare Pages 生效；記得關掉舊的 GitHub Pages。
// ============================================================

const COOKIE = "trip_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 天內免再輸入

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loginPage(showError) {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>2026 名古屋・伊勢志摩・吉卜力</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background: #f6f4ee;
    background-image:
      radial-gradient(circle at 20% 12%, rgba(184,69,46,.05), transparent 42%),
      radial-gradient(circle at 82% 60%, rgba(44,107,107,.05), transparent 45%);
    color: #1c2b46; font-family: "Noto Sans TC", sans-serif; -webkit-font-smoothing: antialiased;
  }
  .card {
    width: 100%; max-width: 340px; background: #fffdf8; border: 1px solid #d9d1bd;
    border-radius: 14px; padding: 34px 26px 28px; text-align: center;
    box-shadow: 0 10px 30px rgba(28,43,70,.08);
  }
  .seal {
    width: 60px; height: 60px; margin: 0 auto 18px; border: 2.5px solid #b8452e; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: #b8452e;
    font-family: "Noto Serif TC", serif; font-size: 24px; font-weight: 700; transform: rotate(-6deg);
    box-shadow: inset 0 0 0 1px rgba(184,69,46,.25);
  }
  h1 { font-family: "Noto Serif TC", serif; font-weight: 700; font-size: 19px; line-height: 1.4; margin: 0 0 6px; }
  .sub { color: #46536b; font-size: 13px; margin: 0 0 20px; letter-spacing: .04em; }
  .pw {
    width: 100%; padding: 12px 14px; font-size: 15px; font-family: inherit;
    border: 1px solid #d9d1bd; border-radius: 8px; background: #fff; color: #1c2b46; outline: none;
  }
  .pw:focus { border-color: #b8452e; box-shadow: 0 0 0 3px rgba(184,69,46,.12); }
  .err { color: #96361f; font-size: 12.5px; margin: 10px 0 0; }
  .btn {
    width: 100%; margin-top: 14px; padding: 12px; font-size: 15px; font-weight: 700; font-family: inherit;
    color: #fffdf8; background: #b8452e; border: none; border-radius: 8px; cursor: pointer; letter-spacing: .08em;
  }
  .btn:hover { background: #96361f; }
</style>
</head>
<body>
  <form class="card" method="POST" action="/__login">
    <div class="seal">旅</div>
    <h1>名古屋・伊勢志摩・吉卜力</h1>
    <p class="sub">請輸入密碼查看行程</p>
    <input class="pw" type="password" name="password" placeholder="密碼" autocomplete="current-password" autofocus required>
    ${showError ? '<p class="err">密碼不對，再試一次</p>' : ''}
    <button class="btn" type="submit">進入</button>
  </form>
</body>
</html>`;
}

export const onRequest = async (context) => {
  const { request, env, next } = context;
  const expected = env.SITE_PASSWORD;
  const htmlHeaders = { "Content-Type": "text/html; charset=utf-8" };

  if (!expected) {
    return new Response("尚未在 Cloudflare Pages 設定 SITE_PASSWORD 環境變數。", {
      status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const token = await sha256Hex(expected);
  const url = new URL(request.url);

  // 處理登入送出
  if (request.method === "POST" && url.pathname === "/__login") {
    const form = await request.formData();
    const pw = (form.get("password") || "").toString();
    if (pw === expected) {
      return new Response(null, {
        status: 303,
        headers: {
          "Set-Cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
          "Location": "/",
        },
      });
    }
    return new Response(loginPage(true), { status: 401, headers: htmlHeaders });
  }

  // 已登入（cookie 正確）→ 放行
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.split(";").some((c) => c.trim() === `${COOKIE}=${token}`)) {
    return next();
  }

  // 未登入 → 顯示自訂登入頁
  return new Response(loginPage(false), { status: 401, headers: htmlHeaders });
};
