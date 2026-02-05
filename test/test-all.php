<?php
// test-security/full-test.php
session_start();

function testItem($name, $condition, $good, $bad) {
    if ($condition) {
        return "<tr style='background:#d4edda;'>
                  <td>✅</td>
                  <td><strong>$name</strong></td>
                  <td>$good</td>
                </tr>";
    } else {
        return "<tr style='background:#f8d7da;'>
                  <td>❌</td>
                  <td><strong>$name</strong></td>
                  <td>$bad</td>
                </tr>";
    }
}

?>
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>اختبار شامل للحماية</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
        th { background: #333; color: white; }
        .passed { color: green; }
        .failed { color: red; }
        .warning { color: orange; }
    </style>
</head>
<body>
    <h1>🔒 تقرير اختبار الحماية الشامل</h1>
    <p>تم الإنشاء في: <?php echo date('Y-m-d H:i:s'); ?></p>
    
    <h2>📋 نتائج الاختبارات</h2>
    <table>
        <tr>
            <th width="50">الحالة</th>
            <th width="200">نوع الاختبار</th>
            <th>النتيجة</th>
        </tr>
        
        <?php
        // 1. اختبار HTTPS
        echo testItem(
            "HTTPS",
            (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
            "مفعل - آمن",
            "غير مفعل - خطير!"
        );
        
        // 2. اختبار الجلسات
        echo testItem(
            "جلسات آمنة",
            ini_get('session.cookie_httponly') == '1' && 
            ini_get('session.cookie_secure') == '1',
            "الجلسات محمية",
            "الجلسات غير آمنة"
        );
        
        // 3. اختبار عرض الأخطاء
        echo testItem(
            "عرض أخطاء PHP",
            ini_get('display_errors') == '0' || ini_get('display_errors') == '',
            "معطل - آمن",
            "مفعل - يظهر معلومات خطيرة"
        );
        
        // 4. اختبار File Uploads
        echo testItem(
            "رفع الملفات",
            ini_get('file_uploads') == '1',
            "مفعل",
            "معطل"
        );
        
        // 5. اختبار Headers
        $headers = headers_list();
        $hasSecurityHeaders = false;
        foreach ($headers as $header) {
            if (preg_match('/X-(Frame|XSS|Content)/i', $header)) {
                $hasSecurityHeaders = true;
                break;
            }
        }
        
        echo testItem(
            "رؤوس الحماية",
            $hasSecurityHeaders,
            "مفعلة",
            "مفقودة"
        );
        
        // 6. اختبار PHP Version
        $phpVersion = phpversion();
        echo testItem(
            "إصدار PHP",
            version_compare($phpVersion, '7.4.0', '>='),
            "حديث ($phpVersion)",
            "قديم ($phpVersion) - يحتاج تحديث"
        );
        
        // 7. اختبار MySQLi
        echo testItem(
            "MySQLi متوفر",
            extension_loaded('mysqli'),
            "متوفر - يمكن استخدام Prepared Statements",
            "غير متوفر - خطر SQL Injection"
        );
        ?>
    </table>
    
    <h2>⚡ اختبارات سريعة</h2>
    <div style="background:#e9ecef; padding:15px; border-radius:5px;">
        <h3>اختبر يدوياً:</h3>
        <ol>
            <li>افتح <a href="../config/" target="_blank">موقعك.com/config/</a> ← يجب أن يظهر 403</li>
            <li>افتح <a href="../.env" target="_blank">موقعك.com/.env</a> ← يجب أن يظهر 403</li>
            <li>افتح <a href="../admin/" target="_blank">موقعك.com/admin/</a> ← يجب أن يظهر 403</li>
            <li>جرب <a href="?test=<script>alert(1)</script>" target="_blank">هذا الرابط</a> ← لا يجب أن يظهر alert</li>
        </ol>
    </div>
    
    <h2>📊 معلومات النظام</h2>
    <pre style="background:#f8f9fa; padding:15px; border-radius:5px;">
نظام التشغيل: <?php echo php_uname(); ?>

إصدار PHP: <?php echo phpversion(); ?>

الخادم: <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'غير معروف'; ?>

التاريخ: <?php echo date('Y-m-d H:i:s'); ?>

IP الزائر: <?php echo $_SERVER['REMOTE_ADDR'] ?? 'غير معروف'; ?>

User Agent: <?php echo $_SERVER['HTTP_USER_AGENT'] ?? 'غير معروف'; ?>
    </pre>
    
    <div style="margin-top:30px; padding:15px; background:#d1ecf1; border-radius:5px;">
        <h3>🎯 خطوات التطوير:</h3>
        <?php
        $needsImprovement = [
            'display_errors' => ini_get('display_errors') != '0',
            'https' => empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == 'off',
            'php_version' => !version_compare(phpversion(), '7.4.0', '>=')
        ];
        
        if (in_array(true, $needsImprovement)) {
            echo "<p style='color:#856404;'>⚠️ هناك مجالات تحتاج تحسين:</p><ul>";
            if ($needsImprovement['display_errors']) echo "<li>عطل display_errors في php.ini</li>";
            if ($needsImprovement['https']) echo "<li>شغل HTTPS على الخادم</li>";
            if ($needsImprovement['php_version']) echo "<li>حدث إصدار PHP</li>";
            echo "</ul>";
        } else {
            echo "<p style='color:#155724;'>✅ كل شيء يبدو جيداً! استمر في الصيانة الدورية.</p>";
        }
        ?>
    </div>
</body>
</html>