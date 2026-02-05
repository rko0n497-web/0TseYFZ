<?php
// تفعيل WAF أولاً
require_once 'config/waf.php';

// تفعيل النظام اللوغ
require_once 'config/advanced-logger.php';
$logger = new SecurityLogger();

// تسجيل دخول المستخدم
$logger->log('INFO', 'Page accessed', ['page' => $_SERVER['REQUEST_URI']]);

// باقي كود الموقع
/**
 *
 * ملف الدخول الرئيسي للموقع
 */

define('SECURE_ACCESS', true);

// إعدادات الوقت
date_default_timezone_set('Asia/Riyadh');

// تحميل ملف الحماية
require_once __DIR__ . '/../config/security.php';

// بدء الجلسة الآمنة
session_start([
    'name' => SecurityConfig::SESSION['name'],
    'cookie_lifetime' => SecurityConfig::SESSION['lifetime'],
    'cookie_secure' => SecurityConfig::SESSION['secure'],
    'cookie_httponly' => SecurityConfig::SESSION['httponly'],
    'cookie_samesite' => SecurityConfig::SESSION['samesite']
]);

// فرض HTTPS
SecurityConfig::forceHTTPS();

// تنظيف المدخلات
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_POST = SecurityConfig::sanitize($_POST);
    
    // التحقق من CSRF Token
    if (SecurityConfig::SECURITY['csrf_protection']) {
        $csrf_token = $_POST['csrf_token'] ?? '';
        if (!SecurityConfig::verifyCSRFToken($csrf_token)) {
            die('Invalid CSRF Token');
        }
    }
}

// توليد CSRF Token جديد
$csrf_token = SecurityConfig::generateCSRFToken();

// عرض الموقع
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>موقع آمن</title>
    <meta name="description" content="موقع محمي بأفضل الممارسات الأمنية">
    
    <!-- حماية ضد XSS -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
</head>
<body>
    <h1>مرحباً في الموقع الآمن</h1>
    
    <!-- نموذج محمي -->
    <form method="POST" action="">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        <input type="text" name="username" placeholder="اسم المستخدم">
        <button type="submit">إرسال</button>
    </form>
    
    <script>
        // حماية JavaScript (مثال مبسط)
        (function() {
            'use strict';
            
            // منع فتح أدوات المطورين (ليست فعالة 100%)
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
            
            document.addEventListener('keydown', function(e) {
                // منع F12 و Ctrl+Shift+I و Ctrl+Shift+J
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                    (e.ctrlKey && e.key === 'U')
                ) {
                    e.preventDefault();
                }
            });
        })();
    </script>
</body>
</html>