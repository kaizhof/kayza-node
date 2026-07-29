// ============================================
// بازی دانه تا درخت (گلدان مجازی)
// ============================================

const PLANT_STAGES = {
    SEED: { emoji: '🌰', image: 'seed.png', label: 'دانه در خاک' },
    SPROUT: { emoji: '🌱', image: 'sprout.png', label: 'جوانه زدن' },
    SEEDLING: { emoji: '🌿', image: 'seedling.png', label: 'گیاه جوان' },
    GROWING: { emoji: '🌳', image: 'growing.png', label: 'در حال رشد' },
    MATURE: { emoji: '🌳', image: 'mature-tree.png', label: 'درخت کامل! 🎉' }
};

let plantState = {
    stage: 'SEED',
    progress: 0, // 0 تا 100
    lastWatered: null,
    daysWatered: 0
};

// ============================================
// بارگذاری وضعیت گیاه از localStorage
// ============================================
function loadPlantStatus() {
    const saved = localStorage.getItem('kayzaPlant');
    if (saved) {
        try {
            plantState = JSON.parse(saved);
        } catch (e) {
            console.warn('خطا در بارگذاری وضعیت گیاه:', e);
        }
    }
    updatePlantUI();
}

// ============================================
// ذخیره وضعیت گیاه
// ============================================
function savePlantStatus() {
    localStorage.setItem('kayzaPlant', JSON.stringify(plantState));
}

// ============================================
// به‌روزرسانی UI گیاه
// ============================================
function updatePlantUI() {
    const stage = PLANT_STAGES[plantState.stage];
    const img = document.getElementById('plantImage');
    const status = document.getElementById('plantStatus');
    const progress = document.getElementById('growthProgress');
    const percent = document.getElementById('growthPercent');
    const tips = document.getElementById('plantTips');

    // به‌روزرسانی تصویر
    img.src = `assets/images/${stage.image}`;
    img.alt = stage.label;

    // به‌روزرسانی وضعیت
    status.textContent = `${stage.emoji} ${stage.label}`;

    // به‌روزرسانی پیشرفت
    const prog = Math.min(plantState.progress, 100);
    progress.value = prog;
    percent.textContent = Math.round(prog) + '%';

    // نکات
    if (plantState.stage === 'MATURE') {
        tips.innerHTML = '🎉 تبریک! گیاه شما به رشد کامل رسید. حالا می‌توانید آن را به درخت واقعی تبدیل کنید!';
    } else {
        const days = plantState.daysWatered || 0;
        tips.innerHTML = `💧 روزهای آبیاری متوالی: ${days} روز. هر روز آبیاری کنید تا گیاه رشد کند.`;
    }

    savePlantStatus();
}

// ============================================
// آبیاری گیاه
// ============================================
async function waterPlant() {
    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    const today = new Date().toDateString();
    const last = plantState.lastWatered ? new Date(plantState.lastWatered).toDateString() : null;

    if (last === today) {
        alert('🌱 امروز قبلاً آبیاری کردید! فردا دوباره امتحان کنید.');
        return;
    }

    // افزایش پیشرفت
    let increment = 5 + Math.floor(Math.random() * 8); // 5 تا 13 درصد
    let newProgress = Math.min(plantState.progress + increment, 100);

    // به‌روزرسانی وضعیت
    plantState.progress = newProgress;
    plantState.lastWatered = new Date().toISOString();
    plantState.daysWatered = (plantState.daysWatered || 0) + 1;

    // به‌روزرسانی مرحله بر اساس پیشرفت
    if (newProgress >= 100) {
        plantState.stage = 'MATURE';
    } else if (newProgress >= 70) {
        plantState.stage = 'GROWING';
    } else if (newProgress >= 40) {
        plantState.stage = 'SEEDLING';
    } else if (newProgress >= 15) {
        plantState.stage = 'SPROUT';
    } else {
        plantState.stage = 'SEED';
    }

    updatePlantUI();

    // پاداش آبیاری
    const reward = 2 + Math.floor(Math.random() * 3);
    alert(`💧 آبیاری انجام شد! +${reward} توکن کایزا دریافت کردید.`);

    // به‌روزرسانی موجودی (شبیه‌سازی)
    const currentBalance = parseInt(document.getElementById('balance').textContent) || 0;
    document.getElementById('balance').textContent = currentBalance + reward;

    // به‌روزرسانی امتیاز سبز
    const currentScore = parseInt(document.getElementById('greenScore').textContent.replace(/[^0-9]/g, '')) || 0;
    document.getElementById('greenScore').textContent = '🏆 ' + (currentScore + 1);

    await loadUserData();
}

// ============================================
// دریافت گزارش رشد
// ============================================
function getPlantReport() {
    const stage = PLANT_STAGES[plantState.stage];
    const progress = Math.round(plantState.progress);
    const days = plantState.daysWatered || 0;

    let message = `📊 گزارش گیاه شما:\n`;
    message += `🌱 مرحله: ${stage.label}\n`;
    message += `📈 پیشرفت: ${progress}%\n`;
    message += `💧 روزهای آبیاری: ${days} روز\n`;

    if (plantState.stage === 'MATURE') {
        message += `🎉 گیاه شما آماده کاشت در طبیعت است!`;
    } else {
        const remaining = 100 - progress;
        const daysNeeded = Math.ceil(remaining / 8);
        message += `⏳ برای رشد کامل، حدود ${daysNeeded} روز دیگر آبیاری کنید.`;
    }

    alert(message);
}

// ============================================
// بازنشانی گیاه (پس از کاشت درخت واقعی)
// ============================================
function resetPlant() {
    plantState = {
        stage: 'SEED',
        progress: 0,
        lastWatered: null,
        daysWatered: 0
    };
    updatePlantUI();
}

// ============================================
// دریافت پیشرفت فعلی
// ============================================
function getPlantProgress() {
    return plantState.progress || 0;
}

// ============================================
// بارگذاری اولیه
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadPlantStatus();
});