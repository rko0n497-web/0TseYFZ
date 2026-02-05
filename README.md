# موقع آمن - دليل التثبيت

## متطلبات النظام
- PHP 7.4 أو أعلى
- Apache مع mod_rewrite
- MySQL 5.7 أو أعلى

## إعدادات الأمان

### 1. إعداد الصلاحيات:
```bash
chmod 755 .
chmod 644 *.php
chmod 600 config/*.php
chmod 700 logs/