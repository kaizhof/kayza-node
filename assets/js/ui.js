// ============================================
// مدیریت رابط کاربری و احراز هویت
// ============================================

let currentAccount = null;
let isConnected = false;

// ============================================
// اتصال به متامسک (احراز هویت)
// ============================================
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('⚠️ لطفاً افزونه متامسک را نصب کنید!');
        window.open('https://metamask.io/download/', '_blank');
        return;
    }

    try {
        // درخواست دسترسی به حساب‌ها
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
            alert('❌ هیچ حسابی در متامسک یافت نشد.');
            return;
        }

        currentAccount = accounts[0];
        isConnected = true;

        // ذخیره در localStorage برای نگهداری جلسه
        localStorage.setItem('kayzaAccount', currentAccount);

        // تغییر وضعیت UI
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('connectBtn').innerHTML = '✅ متصل';

        // نمایش آدرس کاربر
        const shortened = currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
        document.getElementById('userAddress').textContent = shortened;

        // بارگذاری اطلاعات کاربر (موجودی، امتیاز و...)
        await loadUserData();

        // شروع پایش رویدادهای متامسک
        setupMetaMaskListeners();

    } catch (error) {
        console.error('خطا در اتصال:', error);
        if (error.code === 4001) {
            alert('❌ کاربر اتصال را رد کرد.');
        } else {
            alert('❌ خطا در اتصال به متامسک: ' + error.message);
        }
    }
}

// ============================================
// خروج از حساب
// ============================================
function disconnectWallet() {
    currentAccount = null;
    isConnected = false;
    localStorage.removeItem('kayzaAccount');

    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('connectBtn').innerHTML = '🔗 اتصال متامسک';

    // حذف لیسنرها
    window.ethereum.removeAllListeners();
}

// ============================================
// بارگذاری اطلاعات کاربر
// ============================================
async function loadUserData() {
    try {
        // دریافت موجودی توکن
        const balance = await getKayzaBalance(currentAccount);
        document.getElementById('balance').textContent = balance;

        // دریافت امتیاز سبز
        const score = await getGreenScore(currentAccount);
        document.getElementById('greenScore').textContent = '🏆 ' + score;

        // دریافت وضعیت گیاه
        await loadPlantStatus();

        // دریافت تاریخچه
        await loadHistory();

    } catch (error) {
        console.error('خطا در بارگذاری داده‌ها:', error);
    }
}

// ============================================
// پایش رویدادهای متامسک (تغییر حساب، شبکه)
// ============================================
function setupMetaMaskListeners() {
    if (window.ethereum) {
        // تغییر حساب
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else if (accounts[0] !== currentAccount) {
                currentAccount = accounts[0];
                localStorage.setItem('kayzaAccount', currentAccount);
                const shortened = currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
                document.getElementById('userAddress').textContent = shortened;
                loadUserData();
            }
        });

        // تغییر شبکه
        window.ethereum.on('chainChanged', function(chainId) {
            if (chainId !== '0x89') { // پالیگان
                alert('⚠️ لطفاً شبکه را به پالیگان (Polygon) تغییر دهید.');
            }
            window.location.reload();
        });
    }
}

// ============================================
// تابع‌های کمکی برای تب‌ها (منوی داشبورد)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // مدیریت تب‌ها
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // حذف active از همه تب‌ها
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // مخفی کردن همه محتواها
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // نمایش محتوای مربوطه
            const tabId = this.dataset.tab;
            const target = document.getElementById('tab-' + tabId);
            if (target) {
                target.classList.add('active');
            }
        });
    });

    // بررسی اتصال قبلی (از localStorage)
    const savedAccount = localStorage.getItem('kayzaAccount');
    if (savedAccount) {
        // تلاش برای اتصال مجدد
        connectWallet();
    }

    // تنظیم شبکه پیش‌فرض (پالیگان)
    checkNetwork();
});

// ============================================
// بررسی شبکه
// ============================================
async function checkNetwork() {
    if (window.ethereum) {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x89') {
                console.warn('شبکه فعلی پالیگان نیست. لطفاً تغییر دهید.');
                // می‌توانید به کاربر هشدار دهید
            }
        } catch (e) {
            console.error(e);
        }
    }
}