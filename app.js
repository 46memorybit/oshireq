// 固定の遷移先URL
const TARGET_URL = "https://usen.oshireq.com/song/6299592";

// ストレージキー
const STORAGE_KEY = "autoRedirectEnabled";

// 多少の猶予時間（自動遷移ON時にキャンセルできるように）
const REDIRECT_DELAY_MS = 1200;

let redirectTimer = null;

const $ = (sel) => document.querySelector(sel);

function isStandalone() {
  // PWA表示判定（iOS含む）
  return window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function readSetting() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeSetting(val) {
  try {
    localStorage.setItem(STORAGE_KEY, val ? "true" : "false");
  } catch {}
}

function updateUI(enabled) {
  $("#autoToggle").checked = enabled;
  $("#statePill").textContent = enabled ? "ON" : "OFF";
  $("#statePill").style.background = enabled ? "#22c55e33" : "#0ea5e933";
  $("#statePill").style.color = enabled ? "#166534" : "#0369a1";
}

function openTarget() {
  // PWAでもブラウザでもそのまま同一タブ遷移（戻る必要がなければ replace 推奨）
  location.replace(TARGET_URL);
}

function scheduleAutoRedirect() {
  // キャンセル用ボタンの表示
  $("#cancelBtn").style.display = "inline-block";
  const info = $("#info");
  let remaining = Math.ceil(REDIRECT_DELAY_MS / 100) / 10; // 秒表示
  info.textContent = `自動遷移まで約 ${remaining.toFixed(1)} 秒…`;
  const startedAt = Date.now();

  redirectTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const left = Math.max(0, REDIRECT_DELAY_MS - elapsed);
    const sec = Math.ceil(left / 100) / 10;
    info.textContent = `自動遷移まで約 ${sec.toFixed(1)} 秒…`;
    if (left <= 0) {
      clearInterval(redirectTimer);
      redirectTimer = null;
      info.textContent = "遷移中…";
      openTarget();
    }
  }, 100);
}

function cancelAutoRedirect() {
  if (redirectTimer) {
    clearInterval(redirectTimer);
    redirectTimer = null;
    $("#info").textContent = "自動遷移を中止しました。";
    $("#cancelBtn").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 画面初期化
  $("#targetUrlText").textContent = TARGET_URL;

  const enabled = readSetting();
  updateUI(enabled);

  // クリック操作
  $("#openBtn").addEventListener("click", openTarget);

  $("#autoToggle").addEventListener("change", (e) => {
    const on = e.currentTarget.checked;
    writeSetting(on);
    updateUI(on);
    $("#info").textContent = on ? "次回起動時から自動遷移します。" : "自動遷移は無効です。";
  });

  $("#cancelBtn").addEventListener("click", cancelAutoRedirect);

  // 起動時の自動遷移
  if (enabled) {
    // PWAかどうかは問わず、ユーザーの設定を優先
    scheduleAutoRedirect();
  } else {
    $("#info").textContent = "自動遷移はOFFです。必要に応じて「今すぐ開く」を押してください。";
  }
});
