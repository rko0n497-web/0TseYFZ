<?php
// test-security/direct-test.php

// محاولة الوصول المباشر
echo "<h3>🚫 اختبار الوصول المباشر</h3>";

// محاكاة محاولة اختراق
$tests = [
    [
        'name' => 'SQL Injection',
        'input' => "' OR '1'='1",
        'safe' => true  // يجب أن يكون آمناً
    ],
    [
        'name' => 'XSS Attack',
        'input' => '<script>alert("xss")</script>',
        'safe' => true
    ],
    [
        'name' => 'Directory Traversal',
        'input' => '../../etc/passwd',
        'safe' => true
    ],
    [
        'name' => 'Command Injection',
        'input' => '; ls -la',
        'safe' => true
    ]
];

echo "<table border='1' cellpadding='10'>";
echo "<tr><th>نوع الهجوم</th><th>المدخل</th><th>الحالة</th></tr>";

foreach ($tests as $test) {
    $cleaned = htmlspecialchars($test['input'], ENT_QUOTES, 'UTF-8');
    $status = ($cleaned !== $test['input']) ? 
               "✅ محمي" : 
               ($test['safe'] ? "⚠️ يحتاج حماية" : "❌ خطير");
    
    echo "<tr>
            <td>{$test['name']}</td>
            <td><code>{$test['input']}</code></td>
            <td>{$status}</td>
          </tr>";
}

echo "</table>";
?>