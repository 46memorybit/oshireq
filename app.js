// app.js
const cancelBtn = document.getElementById('cancelBtn');
let remain = seconds;
let canceled = false;


overlay.classList.add('show');
overlay.setAttribute('aria-hidden', 'false');
label.textContent = String(remain);


const tick = () => {
if (canceled) return;
remain -= 1;
if (remain <= 0) {
openTarget(url, sameTab);
} else {
label.textContent = String(remain);
setTimeout(tick, 1000);
}
};


const timer = setTimeout(tick, 1000);


cancelBtn.onclick = () => {
canceled = true;
clearTimeout(timer);
overlay.classList.remove('show');
overlay.setAttribute('aria-hidden', 'true');
setStatus('自動遷移をキャンセルしました。');
};
}


// 初期化
window.addEventListener('DOMContentLoaded', () => {
const settings = loadSettings();
applyUI(settings);


// UIイベント
document.getElementById('saveBtn').addEventListener('click', () => {
const s = readUI();
if (!/^https?:\/\//i.test(s.url)) {
setStatus('URLは http(s):// で始まる必要があります。');
return;
}
saveSettings(s);
setStatus('保存しました。');
});


document.getElementById('openBtn').addEventListener('click', () => {
const s = readUI();
if (!/^https?:\/\//i.test(s.url)) {
setStatus('URLは http(s):// で始まる必要があります。');
return;
}
openTarget(s.url, s.sameTab);
});


document.getElementById('resetBtn').addEventListener('click', () => {
saveSettings({ ...DEFAULTS });
applyUI({ ...DEFAULTS });
setStatus('初期化しました（自動遷移：OFF、既定URL、遅延0秒、同一タブ）。');
});


// 起動時の自動遷移（?no_redirect=1 で抑止）
const noRedirect = getQueryFlag('no_redirect') === '1';
if (!noRedirect && settings.enabled) {
if (!/^https?:\/\//i.test(settings.url)) return; // 不正URLは無視


// PWAとしての起動かどうかに関わらず動作。必要なら isStandalone() で分岐可能
// 例: if (isStandalone()) { ... }
const delay = Math.max(0, parseInt(settings.delaySec, 10) || 0);
showOverlayAndRedirect(delay, settings.url, settings.sameTab);
}
});
