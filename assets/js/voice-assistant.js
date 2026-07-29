// ============================================
// دستیار هوشمند کایزا (چت‌بات + صوتی)
// ============================================

// ============================================
// ارسال پیام به چت‌بات
// ============================================
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) {
        alert('⚠️ لطفاً پیام خود را بنویسید.');
        return;
    }

    if (!currentAccount) {
        alert('⚠️ لطفاً ابتدا متامسک را متصل کنید.');
        return;
    }

    // بررسی موجودی برای هزینه مکالمه (۱ توکن)
    const balanceText = document.getElementById('balance').textContent;
    const balance = parseInt(balanceText) || 0;

    if (balance < 1) {
        alert('⛔ موجودی شما برای مکالمه با کایزا کافی نیست. (هزینه: ۱ KAYZA)');
        return;
    }

    // اضافه کردن پیام کاربر به چت
    addChatMessage('user', message);

    // کسر ۱ توکن
    document.getElementById('balance').textContent = balance - 1;

    // پاک کردن ورودی
    input.value = '';

    // نمایش وضعیت تایپ
    addChatMessage('bot', '🤔 در حال فکر کردن...');

    try {
        // پاسخ هوشمند (شبیه‌سازی)
        const reply = await getBotReply(message);
        
        // حذف پیام تایپ و نمایش پاسخ
        const messages = document.getElementById('chatMessages');
        messages.removeChild(messages.lastChild);
        
        addChatMessage('bot', reply);

    } catch (error) {
        console.error('خطا در چت‌بات:', error);
        const messages = document.getElementById('chatMessages');
        if (messages.lastChild && messages.lastChild.textContent.includes('در حال فکر کردن')) {
            messages.removeChild(messages.lastChild);
        }
        addChatMessage('bot', '⚠️ متأسفم، خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
}

// ============================================
// دریافت پاسخ از چت‌بات (شبیه‌سازی)
// ============================================
async function getBotReply(message) {
    // اینجا می‌توانید به API هوش مصنوعی واقعی متصل شوید
    // برای نمونه، پاسخ‌های از پیش تعیین شده برمی‌گردانیم

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('سلام') || lowerMsg.includes('درود')) {
        return '🌱 سلام! من کایزا هستم. چگونه می‌توانم به شما در رشد گیاهتان کمک کنم؟';
    }

    if (lowerMsg.includes('آبیاری') || lowerMsg.includes('آب')) {
        const progress = getPlantProgress();
        if (progress >= 100) {
            return '🌳 گیاه شما کامل شده! وقت کاشت درخت واقعی است.';
        }
        return `💧 گیاه شما ${Math.round(progress)}٪ رشد کرده است. امروز را آبیاری کنید تا رشد کند!`;
    }

    if (lowerMsg.includes('درخت') || lowerMsg.includes('کاشت')) {
        const progress = getPlantProgress();
        if (progress >= 100) {
            return '🎉 عالی! گیاه شما آماده کاشت در طبیعت است. روی دکمه "تبدیل به درخت واقعی" کلیک کنید.';
        }
        return `🌱 گیاه شما ${Math.round(progress)}٪ رشد دارد. به آبیاری ادامه دهید تا به درخت تبدیل شود.`;
    }

    if (lowerMsg.includes('امتیاز') || lowerMsg.includes('سبز')) {
        const score = document.getElementById('greenScore').textContent;
        return `🏆 امتیاز سبز شما: ${score}. هرچه بیشتر اقدام کنید، تأثیر بیشتری بر زمین می‌گذارید!`;
    }

    if (lowerMsg.includes('خیریه') || lowerMsg.includes('کمک')) {
        return '❤️ شما می‌توانید به محک (کودکان سرطانی) یا امام رضا (ع) (ایتام) کمک کنید. هر کمکی روی بلاک‌چین ثبت می‌شود.';
    }

    if (lowerMsg.includes('بازارچه') || lowerMsg.includes('خرید')) {
        return '🛒 در بازارچه سبز می‌توانید خودرو برقی، پنل خورشیدی و دوچرخه بخرید و امتیاز سبز بگیرید!';
    }

    if (lowerMsg.includes('گناه') || lowerMsg.includes('ثواب')) {
        return '🌱 هر دانه‌ای که می‌کارید، ثوابی است برای زمین. هر درختی که کاشته می‌شود، یک طوفان را مهار می‌کند.';
    }

    // پاسخ پیش‌فرض
    const tips = [
        '🌱 هر روز آبیاری کنید تا گیاهتان رشد کند.',
        '🌳 با کاشت هر درخت، یک طوفان را مهار می‌کنید.',
        '❤️ کمک‌های شما شفاف روی بلاک‌چین ثبت می‌شود.',
        '🛒 در بازارچه سبز، محصولات دوستدار محیط زیست بخرید.',
        '🤖 من اینجام تا به شما در مسیر سبزتان کمک کنم.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// ============================================
// اضافه کردن پیام به چت
// ============================================
function addChatMessage(type, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ============================================
// شروع تشخیص صدا
// ============================================
function startVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('⚠️ مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند. لطفاً از کروم استفاده کنید.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        document.querySelector('.chat-input .btn-secondary').textContent = '🎤 گوش می‌کنم...';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chatInput').value = transcript;
        document.querySelector('.chat-input .btn-secondary').textContent = '🎤 صدا';
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error('خطا در تشخیص صدا:', event.error);
        document.querySelector('.chat-input .btn-secondary').textContent = '🎤 صدا';
        alert('❌ خطا در تشخیص صدا: ' + event.error);
    };

    recognition.onend = function() {
        document.querySelector('.chat-input .btn-secondary').textContent = '🎤 صدا';
    };

    recognition.start();
}

// ============================================
// ارسال پیام با کلید Enter
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});