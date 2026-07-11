// ============================================================
// Cloudflare Pages Functions — 全站簡易密碼保護（HTTP Basic Auth）
// ------------------------------------------------------------
// 這支程式會在「伺服器端」攔截每一個請求（含 data.js、憑證圖片/PDF），
// 沒帶對密碼一律擋下，所以是真正的鎖，不是前端假鎖。
//
// 密碼設定在 Cloudflare Pages 專案的「環境變數 SITE_PASSWORD」，
// 不寫在程式碼裡（所以就算 repo 公開，也看不到密碼）。
//
// ※ 這個檔案只在 Cloudflare Pages 上生效；GitHub Pages 不會執行它，
//    所以設定完 Cloudflare 後，記得把 GitHub Pages 關掉。
// ============================================================

export const onRequest = async (context) => {
  const { request, env, next } = context;
  const expected = env.SITE_PASSWORD;

  // 還沒在 Cloudflare 設定密碼時，給明確提示（避免以為網站壞了）
  if (!expected) {
    return new Response("尚未在 Cloudflare Pages 設定 SITE_PASSWORD 環境變數。", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    let decoded = "";
    try { decoded = atob(encoded); } catch (e) { decoded = ""; }
    const password = decoded.slice(decoded.indexOf(":") + 1); // 帳號欄不管，只比對密碼
    if (password === expected) {
      return next(); // 密碼正確 → 放行，正常顯示網站
    }
  }

  // 沒帶或帶錯密碼 → 跳出瀏覽器內建的登入視窗
  return new Response("需要密碼才能瀏覽此行程。", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="2026 名古屋行程", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
