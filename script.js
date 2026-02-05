/**
 * ملف JavaScript الرئيسي للموقع
 * يحتوي على جميع الوظائف التفاعلية
 */

// الانتظار حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 1. تبديل وضع الألوان (فاتح/داكن)
    // ===========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // التحقق من الوضع الحالي في localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // تحديث الأيقونة بناءً على الوضع الحالي
    if (currentTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // تبديل الوضع عند النقر
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // تطبيق الوضع الجديد
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تغيير الأيقونة
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // إضافة تأثير للزر
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // ===========================================
    // 2. القائمة المتنقلة للأجهزة الصغيرة
    // ===========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // منع التمرير عند فتح القائمة
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // ===========================================
    // 3. تصفية الدورات في صفحة الدورات
    // ===========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const sortSelect = document.getElementById('sort');
    
    if (filterButtons.length > 0) {
        // تصفية الدورات حسب الفئة
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة النشاط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة النشاط للزر المختار
                this.classList.add('active');
                
                // الحصول على قيمة التصفية
                const filterValue = this.getAttribute('data-filter');
                
                // تصفية البطاقات
                courseCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // ترتيب الدورات حسب المعيار المختار
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortValue = this.value;
                const coursesArray = Array.from(courseCards);
                const container = document.querySelector('.courses-grid');
                
                // فرز المصفوفة حسب المعيار المختار
                coursesArray.sort((a, b) => {
                    switch (sortValue) {
                        case 'newest':
                            return 0; // في الواقع سيتم ترتيب حسب تاريخ الإضافة
                        case 'popular':
                            return 0; // في الواقع سيتم ترتيب حسب الشعبية
                        case 'duration':
                            const aDuration = parseInt(a.querySelector('.meta-item span')?.textContent) || 0;
                            const bDuration = parseInt(b.querySelector('.meta-item span')?.textContent) || 0;
                            return aDuration - bDuration;
                        case 'difficulty':
                            const aLevel = a.querySelector('.course-level')?.textContent;
                            const bLevel = b.querySelector('.course-level')?.textContent;
                            const levels = { 'مبتدئ': 1, 'متوسط': 2, 'متقدم': 3 };
                            return (levels[aLevel] || 0) - (levels[bLevel] || 0);
                        default:
                            return 0;
                    }
                });
                
                // إعادة إضافة البطاقات بالترتيب الجديد
                container.innerHTML = '';
                coursesArray.forEach(card => {
                    container.appendChild(card);
                });
            });
        }
    }
    
    // ===========================================
    // 4. نموذج التواصل
    // ===========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع البيانات من النموذج
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // التحقق من صحة البيانات
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // التحقق من صحة البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // في الواقع، هنا سيتم إرسال البيانات إلى الخادم
            // لكننا سنقوم بمحاكاة الإرسال الناجح
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.', 'success');
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
            // تسجيل البيانات في الكونسول (للأغراض التوضيحية)
            console.log('بيانات التواصل:', formData);
        });
    }
    
    // ===========================================
    // 5. تأثيرات التمرير
    // ===========================================
    // إضافة تأثيرات ظهور عند التمرير
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر المراد تحريكها
    const animateElements = document.querySelectorAll('.domain-card, .update-card, .course-card, .philosophy-card, .tip-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // ===========================================
    // 6. تأثيرات إضافية
    // ===========================================
    // تأثير عند التمرير لشريط التنقل
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
    
    // إضافة CSS للتحريك
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn-block {
            width: 100%;
        }
        
        .courses-search {
            display: flex;
            gap: 10px;
            margin-top: 30px;
            max-width: 600px;
            margin-right: auto;
            margin-left: auto;
        }
        
        .courses-search input {
            flex-grow: 1;
            padding: 15px 20px;
            border: 2px solid var(--primary-light);
            border-radius: var(--radius-md);
            font-family: var(--font-primary);
            font-size: var(--font-size-md);
        }
        
        .courses-search input:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .filters-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
            background-color: var(--bg-card);
            border-radius: var(--radius-lg);
            margin-bottom: 30px;
        }
        
        .filter-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 10px 20px;
            background-color: var(--bg-light);
            border: 2px solid var(--primary-light);
            border-radius: var(--radius-md);
            font-weight: 700;
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .filter-btn.active,
        .filter-btn:hover {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .sort-by {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .sort-by select {
            padding: 10px 15px;
            border: 2px solid var(--primary-light);
            border-radius: var(--radius-md);
            font-family: var(--font-primary);
            font-size: var(--font-size-md);
            background-color: var(--bg-light);
            color: var(--text-dark);
        }
        
        .course-card {
            background-color: var(--bg-card);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
            border: 1px solid rgba(139, 115, 85, 0.1);
            opacity: 0;
            transform: translateY(20px);
        }
        
        .course-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-lg);
            border-color: var(--primary-light);
        }
        
        .course-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background-color: var(--primary-color);
            color: white;
            padding: 5px 15px;
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            font-weight: 700;
            z-index: 2;
        }
        
        .course-platform {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: rgba(139, 115, 85, 0.05);
        }
        
        .platform-logo {
            padding: 5px 15px;
            border-radius: var(--radius-md);
            font-weight: 700;
            font-size: var(--font-size-sm);
        }
        
        .platform-logo.edraak {
            background-color: #2D5F7C;
            color: white;
        }
        
        .platform-logo.sutur {
            background-color: #8B7355;
            color: white;
        }
        
        .platform-logo.coursera {
            background-color: #0056D2;
            color: white;
        }
        
        .platform-logo.udemy {
            background-color: #A435F0;
            color: white;
        }
        
        .platform-logo.freecodecamp {
            background-color: #0A0A23;
            color: white;
        }
        
        .platform-logo.youtube {
            background-color: #FF0000;
            color: white;
        }
        
        .course-level {
            padding: 5px 15px;
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            font-weight: 700;
        }
        
        .course-level.easy {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
        }
        
        .course-level.intermediate {
            background-color: rgba(255, 152, 0, 0.1);
            color: #FF9800;
        }
        
        .course-level.advanced {
            background-color: rgba(244, 67, 54, 0.1);
            color: #F44336;
        }
        
        .course-image {
            height: 180px;
            overflow: hidden;
        }
        
        .course-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform var(--transition-normal);
        }
        
        .course-card:hover .course-image img {
            transform: scale(1.05);
        }
        
        .course-content {
            padding: 20px;
        }
        
        .course-title {
            font-size: var(--font-size-lg);
            font-weight: 800;
            margin-bottom: 10px;
            color: var(--text-dark);
            height: 60px;
            overflow: hidden;
        }
        
        .course-description {
            color: var(--text-light);
            margin-bottom: 20px;
            line-height: 1.6;
            height: 80px;
            overflow: hidden;
        }
        
        .course-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(139, 115, 85, 0.1);
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--text-light);
            font-size: var(--font-size-sm);
        }
        
        .meta-item i {
            color: var(--primary-color);
        }
        
        .course-instructor {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            color: var(--text-medium);
            font-size: var(--font-size-sm);
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 50px;
        }
        
        .page-btn {
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--primary-light);
            border-radius: var(--radius-md);
            background-color: var(--bg-light);
            font-weight: 700;
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .page-btn.active,
        .page-btn:hover {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .page-btn.next {
            width: auto;
            padding: 0 20px;
        }
        
        .about-hero {
            padding: 150px 0 80px;
            background: linear-gradient(135deg, rgba(139, 115, 85, 0.1), rgba(193, 154, 107, 0.1));
            text-align: center;
        }
        
        .about-hero-title {
            font-size: var(--font-size-5xl);
            font-weight: 900;
            margin-bottom: 20px;
            color: var(--text-dark);
        }
        
        .about-hero-subtitle {
            font-size: var(--font-size-xl);
            color: var(--text-light);
            max-width: 700px;
            margin: 0 auto;
        }
        
        .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            padding: 80px 0;
        }
        
        .image-frame {
            width: 350px;
            height: 350px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto;
            border: 8px solid var(--bg-card);
            box-shadow: var(--shadow-lg);
            position: relative;
        }
        
        .image-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .about-title {
            font-size: var(--font-size-4xl);
            font-weight: 800;
            margin-bottom: 20px;
            color: var(--text-dark);
        }
        
        .about-description {
            color: var(--text-light);
            margin-bottom: 20px;
            line-height: 1.8;
            font-size: var(--font-size-lg);
        }
        
        .about-stats {
            display: flex;
            gap: 30px;
            margin-top: 30px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: var(--font-size-3xl);
            font-weight: 900;
            color: var(--primary-color);
            line-height: 1;
        }
        
        .stat-label {
            font-size: var(--font-size-sm);
            color: var(--text-light);
            margin-top: 5px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
        }
        
        .skill-category-title {
            font-size: var(--font-size-xl);
            font-weight: 800;
            margin-bottom: 30px;
            color: var(--text-dark);
            padding-bottom: 10px;
            border-bottom: 3px solid var(--primary-color);
        }
        
        .skill-item {
            margin-bottom: 25px;
        }
        
        .skill-name {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: 700;
            color: var(--text-dark);
        }
        
        .skill-bar {
            height: 10px;
            background-color: rgba(139, 115, 85, 0.1);
            border-radius: var(--radius-full);
            overflow: hidden;
        }
        
        .skill-level {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            border-radius: var(--radius-full);
            transition: width 1s ease;
        }
        
        .skill-percentage {
            font-size: var(--font-size-sm);
            color: var(--primary-color);
            font-weight: 700;
        }
        
        .philosophy-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .philosophy-card {
            background-color: var(--bg-card);
            border-radius: var(--radius-lg);
            padding: 40px 30px;
            text-align: center;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
            border: 1px solid rgba(139, 115, 85, 0.1);
        }
        
        .philosophy-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-lg);
            border-color: var(--primary-light);
        }
        
        .philosophy-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
            font-size: var(--font-size-2xl);
            color: white;
        }
        
        .philosophy-title {
            font-size: var(--font-size-xl);
            font-weight: 800;
            margin-bottom: 15px;
            color: var(--text-dark);
        }
        
        .philosophy-description {
            color: var(--text-light);
            line-height: 1.7;
        }
        
        .tips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        
        .tip-card {
            background-color: var(--bg-card);
            border-radius: var(--radius-lg);
            padding: 30px;
            text-align: center;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
            border: 1px solid rgba(139, 115, 85, 0.1);
        }
        
        .tip-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary-light);
        }
        
        .tip-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(139, 115, 85, 0.1), rgba(193, 154, 107, 0.1));
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: var(--font-size-xl);
            color: var(--primary-color);
        }
        
        .tip-title {
            font-size: var(--font-size-lg);
            font-weight: 800;
            margin-bottom: 15px;
            color: var(--text-dark);
        }
        
        .tip-description {
            color: var(--text-light);
            line-height: 1.7;
        }
        
        .courses-hero {
            padding: 150px 0 80px;
            background: linear-gradient(135deg, rgba(139, 115, 85, 0.1), rgba(193, 154, 107, 0.1));
            text-align: center;
        }
        
        .courses-hero-title {
            font-size: var(--font-size-5xl);
            font-weight: 900;
            margin-bottom: 20px;
            color: var(--text-dark);
        }
        
        .courses-hero-subtitle {
            font-size: var(--font-size-xl);
            color: var(--text-light);
            max-width: 700px;
            margin: 0 auto;
        }
        
        .learning-tips {
            padding: 80px 0;
            background-color: var(--bg-light);
        }
    `;
    
    document.head.appendChild(style);
    
    // ===========================================
    // 7. وظيفة عرض الإشعارات
    // ===========================================
    function showNotification(message, type) {
        // إنصراف العنصر إذا كان موجودًا
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // إضافة أنماط CSS للإشعار
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                left: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: var(--radius-md);
                font-weight: 700;
                z-index: 9999;
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
                max-width: 500px;
                margin: 0 auto;
                text-align: center;
            }
            
            .notification-success {
                background-color: #4CAF50;
                color: white;
                border-right: 5px solid #388E3C;
            }
            
            .notification-error {
                background-color: #F44336;
                color: white;
                border-right: 5px solid #D32F2F;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                    visibility: hidden;
                }
            }
        `;
        
        document.head.appendChild(notificationStyle);
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوانٍ
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (notificationStyle.parentNode) {
                notificationStyle.remove();
            }
        }, 3300);
    }
    
    // ===========================================
    // 8. تهيئة إضافية
    // ===========================================
    // إضافة تأثيرات للروابط
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // التأكد من أن الروابط الداخلية تعمل بشكل سلس
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // تحميل الصور بشكل كسول (Lazy Loading)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    // تسجيل رسالة في الكونسول عند التحميل
    console.log('تم تحميل الموقع بنجاح!');
});
// تشفير في JavaScript
import CryptoJS from 'crypto-js';

// تشفير AES
const encrypted = CryptoJS.AES.encrypt(
    'بيانات سرية',
    'مفتاح_سري_قوي'
).toString();

// فك التشفير
const decrypted = CryptoJS.AES.decrypt(
    encrypted,
    'مفتاح_سري_قوي'
).toString(CryptoJS.enc.Utf8);