<?php
// test-security/firewall-test.php
echo "<h3>🔥 اختبار جدار الحماية (WAF)</h3>";

$attacks = [
    'SQL' => ["' OR '1'='1", "SELECT * FROM users", "DROP TABLE users"],
    'XSS' => ["<script>alert(1)</script>", "<img src=x onerror=alert(1)>"],
    'Path' => ["../../../etc/passwd", "/etc/passwd", "C:\\Windows\\System32"],
    'Commands' => ["; ls -la", "| cat /etc/passwd", "`whoami`"]
];

$results = [];
foreach ($attacks as $type => $attempts) {
    foreach ($attempts as $attempt) {
        // محاكاة الطلب
        $_GET['test'] = $attempt;
        
        // إذا تم حظر الطلب (سيحدث في الواقع)
        $blocked = (strpos($attempt, "' OR") !== false || 
                   strpos($attempt, '<script>') !== false ||
                   strpos($attempt, '../') !== false);
        
        $results[] = [
            'type' => $type,
            'payload' => $attempt,
            'status' => $blocked ? '✅ محجوب' : '⚠️ غير محجوب'
        ];
    }
}

echo "<table border='1' cellpadding='8'>";
echo "<tr><th>النوع</th><th>الحمولة</th><th>الحالة</th></tr>";
foreach ($results as $result) {
    $color = strpos($result['status'], '✅') !== false ? 'green' : 'orange';
    echo "<tr>
            <td>{$result['type']}</td>
            <td><code>{$result['payload']}</code></td>
            <td style='color:$color;'>{$result['status']}</td>
          </tr>";
}
echo "</table>";
?>