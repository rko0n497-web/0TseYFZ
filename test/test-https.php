<?php
// test-security/https-test.php
echo "<h3>🔒 اختبار HTTPS والحماية</h3>";

// 1. HTTPS Check
echo "<p>1. HTTPS: " . 
     (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 
     "✅ <span style='color:green'>مفعل</span>" : 
     "❌ <span style='color:red'>غير مفعل</span>") . 
     "</p>";

// 2. Headers Check
echo "<p>2. رؤوس الحماية:</p><ul>";
$headers = headers_list();
$security_headers = [
    'X-Frame-Options' => false,
    'X-XSS-Protection' => false,
    'X-Content-Type-Options' => false
];

foreach ($headers as $header) {
    foreach ($security_headers as $key => $value) {
        if (stripos($header, $key) !== false) {
            $security_headers[$key] = true;
            echo "<li>✅ $header</li>";
        }
    }
}

foreach ($security_headers as $key => $found) {
    if (!$found) echo "<li>❌ $key مفقود</li>";
}
echo "</ul>";

// 3. File Permissions
echo "<p>3. صلاحيات الملفات:</p>";
$files = ['../.htaccess', '../config.php', '../.env'];
foreach ($files as $file) {
    if (file_exists($file)) {
        $perms = substr(sprintf('%o', fileperms($file)), -3);
        $status = ($perms <= '600') ? "✅ آمن ($perms)" : "⚠️ خطير ($perms)";
        echo "<p>$file: $status</p>";
    }
}
?>