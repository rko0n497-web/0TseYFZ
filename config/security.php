<?php
/**
 * ملف حماية الموقع
 * DO NOT EDIT
 */

// منع الوصول المباشر
if (!defined('SECURE_ACCESS')) {
    http_response_code(403);
    exit('Direct access not permitted');
}

class SecurityConfig {
    
    // إعدادات الحماية
    const SECURITY = [
        'csrf_protection' => true,
        'xss_protection' => true,
        'sql_injection_protection' => true,
        'rate_limiting' => true,
        'session_secure' => true
    ];
    
    // إعدادات الجلسات
    const SESSION = [
        'name' => 'SECURE_SESSION',
        'lifetime' => 3600,
        'path' => '/',
        'domain' => '',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ];
    
    // التحقق من HTTPS
    public static function forceHTTPS() {
        if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
            header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
            exit();
        }
    }
    
    // تنظيع المدخلات
    public static function sanitize($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitize'], $input);
        }
        
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        
        return $input;
    }
    
    // توليد CSRF Token
    public static function generateCSRFToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    // التحقق من CSRF Token
    public static function verifyCSRFToken($token) {
        if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
            return false;
        }
        return true;
    }
}
?>