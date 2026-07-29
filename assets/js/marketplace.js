// ============================================
// بازارچه سبز - خرید محصولات دوستدار محیط زیست
// ============================================

// ============================================
// خرید محصول
// ============================================
async function buyProduct(productId) {
    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    const products = {
        car: {
            name: 'خودرو برقی',
            price: 100,
            co2Reduction: '۲ تن کربن در سال',
            emoji: '🚗'
        },
        solar: {
            name: 'پنل خورشیدی',
            price: 50,
            co2Reduction: 'تأمین انرژی پاک',
            emoji: '☀️'
        },
        bike: {
            name: 'دوچرخه',
            price: 10,
            co2Reduction: 'حمل‌ونقل بدون آلایندگی',
            emoji: '🚲'
        }
    };

    const product = products[productId];
    if (!product) {
        alert('❌ محصول یافت نشد.');
        return;
    }

    // بررسی موجودی کافی
    const balanceText = document.getElementById('balance').textContent;
    const balance = parseInt(balanceText) || 0;

    if (balance < product.price) {
        alert(`⛔ موجودی شما (${balance} KAYZA) برای خرید ${product.name} کافی نیست.`);
        return;
    }

    // تأیید خرید
    const confirmMsg = `🛒 آیا از خرید ${product.emoji} ${product.name} به قیمت ${product.price} KAYZA مطمئن هستید؟\n🌍 تأثیر: ${product.co2Reduction}`;
    if (!confirm(confirmMsg)) {
        return;
    }

    try {
        // شبیه‌سازی تراکنش
        const newBalance = balance - product.price;
        document.getElementById('balance').textContent = newBalance;

        // ثبت در تاریخچه
        addHistoryItem('buy', `${product.emoji} ${product.name}`, product.price);

        // پیام موفقیت
        alert(`✅ ${product.emoji} ${product.name} با موفقیت خریداری شد!\n🌍 تأثیر: ${product.co2Reduction}`);

        // به‌روزرسانی امتیاز سبز (کاهش کربن)
        const scoreText = document.getElementById('greenScore').textContent;
        const currentScore = parseInt(scoreText.replace(/[^0-9]/g, '')) || 0;
        const bonus = productId === 'car' ? 20 : (productId === 'solar' ? 10 : 5);
        document.getElementById('greenScore').textContent = '🏆 ' + (currentScore + bonus);

        // ذخیره در localStorage
        savePurchaseHistory(productId, product);

    } catch (error) {
        console.error('خطا در خرید:', error);
        alert('❌ خطا در خرید محصول: ' + error.message);
    }
}

// ============================================
// ذخیره تاریخچه خرید
// ============================================
function savePurchaseHistory(productId, product) {
    const history = JSON.parse(localStorage.getItem('kayzaPurchaseHistory') || '[]');
    history.push({
        productId: productId,
        name: product.name,
        price: product.price,
        date: new Date().toISOString()
    });
    localStorage.setItem('kayzaPurchaseHistory', JSON.stringify(history));
}