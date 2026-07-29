// ============================================
// ارتباط با قرارداد هوشمند کایزا
// ============================================

// ============================================
// تنظیمات (از config.json بارگذاری می‌شود)
// ============================================
const CONFIG = {
    contractAddress: '0x...', // آدرس قرارداد اصلی (پس از استقرار)
    charityWallets: {
        mahak: '0x...', // آدرس کیف پول محک
        imamreza: '0x...' // آدرس کیف پول امام رضا (ع)
    },
    network: {
        chainId: '0x89', // پالیگان
        rpc: 'https://polygon-rpc.com'
    }
};

let web3 = null;
let kayzaContract = null;

// ============================================
// مقداردهی اولیه Web3
// ============================================
function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        return true;
    } else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider);
        return true;
    } else {
        console.error('Web3 یافت نشد.');
        return false;
    }
}

// ============================================
// دریافت موجودی توکن
// ============================================
async function getKayzaBalance(address) {
    try {
        if (!web3) initWeb3();
        // در نسخه واقعی، از قرارداد توکن استفاده می‌شود
        // اینجا یک مقدار شبیه‌سازی شده برمی‌گردانیم
        const mockBalance = Math.floor(Math.random() * 1000) + 50;
        return mockBalance;
    } catch (error) {
        console.error('خطا در دریافت موجودی:', error);
        return 0;
    }
}

// ============================================
// دریافت امتیاز سبز
// ============================================
async function getGreenScore(address) {
    try {
        // شبیه‌سازی
        const mockScore = Math.floor(Math.random() * 500) + 10;
        return mockScore;
    } catch (error) {
        console.error('خطا در دریافت امتیاز:', error);
        return 0;
    }
}

// ============================================
// کاشت درخت (واقعی)
// ============================================
async function plantTreeReal() {
    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    try {
        // بررسی پیشرفت گیاه
        const progress = getPlantProgress();
        if (progress < 100) {
            alert('🌱 گیاه شما هنوز به رشد کامل نرسیده است! ابتدا آن را به ۱۰۰٪ برسانید.');
            return;
        }

        // در نسخه واقعی، تابع قرارداد فراخوانی می‌شود
        // const tx = await kayzaContract.methods.plantTree().send({ from: currentAccount });
        // console.log('تراکنش:', tx);

        alert('🌳 درخت شما با موفقیت در طبیعت کاشته شد! +۵۰ توکن کایزا دریافت کردید.');
        
        // به‌روزرسانی UI
        resetPlant();
        await loadUserData();

    } catch (error) {
        console.error('خطا در کاشت درخت:', error);
        alert('❌ خطا در کاشت درخت: ' + error.message);
    }
}

// ============================================
// کمک به خیریه
// ============================================
async function donateToCharity(charityName) {
    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    const inputId = charityName === 'mahak' ? 'donateMahak' : 'donateImam';
    const amountInput = document.getElementById(inputId);
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
        alert('⚠️ لطفاً مبلغ معتبر وارد کنید.');
        return;
    }

    try {
        const wallet = CONFIG.charityWallets[charityName];
        if (!wallet) {
            alert('❌ آدرس کیف پول خیریه یافت نشد.');
            return;
        }

        // در نسخه واقعی، تراکنش انتقال انجام می‌شود
        // const weiAmount = web3.utils.toWei(amount.toString(), 'ether');
        // await web3.eth.sendTransaction({
        //     from: currentAccount,
        //     to: wallet,
        //     value: weiAmount
        // });

        alert(`❤️ کمک ${amount} دلار با موفقیت به ${charityName === 'mahak' ? 'محک' : 'امام رضا (ع)'} انجام شد!`);
        
        // به‌روزرسانی
        amountInput.value = '';
        await loadUserData();

    } catch (error) {
        console.error('خطا در کمک:', error);
        alert('❌ خطا در انجام کمک: ' + error.message);
    }
}

// ============================================
// خرید از بازارچه
// ============================================
async function buyProduct(productId) {
    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    const prices = {
        car: 100,
        solar: 50,
        bike: 10
    };

    const price = prices[productId];
    if (!price) return;

    // بررسی موجودی کافی
    const balance = await getKayzaBalance(currentAccount);
    if (balance < price) {
        alert(`⛔ موجودی شما (${balance} KAYZA) برای خرید این محصول کافی نیست.`);
        return;
    }

    try {
        // در نسخه واقعی، تابع قرارداد فراخوانی می‌شود
        alert(`✅ محصول با موفقیت خریداری شد! ${price} KAYZA از حساب شما کسر شد.`);
        await loadUserData();

    } catch (error) {
        console.error('خطا در خرید:', error);
        alert('❌ خطا در خرید محصول: ' + error.message);
    }
}