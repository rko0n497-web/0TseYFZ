<?php
// test-security/csrf-test.php
session_start();

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h3>نتيجة اختبار CSRF:</h3>";
    
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        echo "<p style='color:green;'>✅ نجاح! تم رفض الطلب بدون token</p>";
    } else {
        echo "<p style='color:red;'>❌ خطر! يجب رفض الطلب حتى مع token صحيح في هذا الاختبار</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<body>
    <h3>🛡️ اختبار CSRF Protection</h3>
    
    <!-- نموذج بدون token (يجب رفضه) -->
    <form method="POST" action="">
        <h4>نموذج بدون CSRF Token:</h4>
        <input type="text" name="amount" value="1000" readonly>
        <button type="submit">ارسال تحويل (اختبار)</button>
    </form>
    
    <!-- نموذج مع token -->
    <form method="POST" action="">
        <h4>نموذج مع CSRF Token:</h4>
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <input type="text" name="amount" value="1000" readonly>
        <button type="submit">ارسال تحويل (شرعي)</button>
    </form>
    
    <hr>
    
    <!-- اختبار من موقع خارجي -->
    <h4>محاكاة هجوم CSRF:</h4>
    <button onclick="simulateCSRF()">محاكاة هجوم من موقع آخر</button>
    
    <script>
    function simulateCSRF() {
        // هذا يحاكي هجوماً من موقع خارجي
        fetch('test-csrf.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'amount=5000&action=transfer'
        })
        .then(response => response.text())
        .then(data => {
            alert('نتيجة المحاكاة: ' + (data.includes('نجاح') ? 'محمي' : 'غير محمي'));
        });
    }
    </script>
</body>
</html>