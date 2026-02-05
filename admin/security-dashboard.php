<?php
// advanced-logger.php
class SecurityLogger {
    
    private $logFile;
    private $db;
    
    public function __construct($logFile = 'security.log') {
        $this->logFile = __DIR__ . '/logs/' . $logFile;
        $this->ensureLogDirectory();
    }
    
    public function log($level, $message, $context = []) {
        $entry = $this->formatLogEntry($level, $message, $context);
        
        // كتابة في الملف
        file_put_contents($this->logFile, $entry, FILE_APPEND);
        
        // إرسال تنبيه إذا كان مستوى خطير
        if (in_array($level, ['CRITICAL', 'EMERGENCY'])) {
            $this->sendAlert($level, $message, $context);
        }
        
        // حفظ في قاعدة البيانات إذا كانت متوفرة
        if ($this->db) {
            $this->saveToDatabase($level, $message, $context);
        }
    }
    
    private function formatLogEntry($level, $message, $context) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $requestUrl = $_SERVER['REQUEST_URI'] ?? '/';
        
        $contextStr = !empty($context) ? json_encode($context, JSON_UNESCAPED_UNICODE) : '';
        
        return sprintf(
            "[%s] %-9s | IP: %-15s | URL: %s | Agent: %s | Message: %s | Context: %s\n",
            $timestamp,
            $level,
            $ip,
            $requestUrl,
            substr($userAgent, 0, 50),
            $message,
            $contextStr
        );
    }
    
    private function sendAlert($level, $message, $context) {
        // إرسال بريد إلكتروني
        $to = 'admin@yoursite.com';
        $subject = "🚨 تنبيه أمني: $level";
        
        $body = "تنبيه أمني من موقعك:\n\n";
        $body .= "المستوى: $level\n";
        $body .= "الرسالة: $message\n";
        $body .= "الوقت: " . date('Y-m-d H:i:s') . "\n";
        $body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
        
        if (!empty($context)) {
            $body .= "البيانات: " . json_encode($context, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
        }
        
        mail($to, $subject, $body);
        
        // إرسال إلى Telegram Bot (اختياري)
        $this->sendTelegramAlert($level, $message, $context);
    }
    
    private function sendTelegramAlert($level, $message, $context) {
        $botToken = 'YOUR_BOT_TOKEN';
        $chatId = 'YOUR_CHAT_ID';
        
        $text = urlencode(
            "🚨 *تنبيه أمني*\n" .
            "• الموقع: " . $_SERVER['HTTP_HOST'] . "\n" .
            "• المستوى: `$level`\n" .
            "• الرسالة: $message\n" .
            "• IP: `" . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "`"
        );
        
        $url = "https://api.telegram.org/bot{$botToken}/sendMessage?chat_id={$chatId}&text={$text}&parse_mode=Markdown";
        
        @file_get_contents($url);
    }
    
    private function ensureLogDirectory() {
        $dir = dirname($this->logFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
    
    public function setDatabase($db) {
        $this->db = $db;
    }
    
    private function saveToDatabase($level, $message, $context) {
        // حفظ في قاعدة البيانات
        $stmt = $this->db->prepare(
            "INSERT INTO security_logs (level, message, ip, user_agent, url, context, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())"
        );
        
        $stmt->execute([
            $level,
            $message,
            $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
            $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            $_SERVER['REQUEST_URI'] ?? '/',
            json_encode($context, JSON_UNESCAPED_UNICODE)
        ]);
    }
    
    public function getRecentLogs($limit = 100) {
        if (!file_exists($this->logFile)) {
            return [];
        }
        
        $lines = file($this->logFile, FILE_IGNORE_NEW_LINES);
        return array_slice(array_reverse($lines), 0, $limit);
    }
}

// استخدام الملف
$logger = new SecurityLogger();

// أمثلة على التسجيل
$logger->log('INFO', 'User logged in', ['username' => 'user123']);
$logger->log('WARNING', 'Failed login attempt', ['ip' => '192.168.1.1', 'attempts' => 5]);
$logger->log('CRITICAL', 'SQL injection attempt detected', ['query' => $_GET['q'] ?? '']);
?>