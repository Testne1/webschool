<?php
try {
    $db = new PDO('sqlite:school_management.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec("
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_name TEXT NOT NULL UNIQUE
        );
    ");

    // Tạo bảng `error_types`
    $db->exec("
        CREATE TABLE IF NOT EXISTS error_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            error_name TEXT NOT NULL UNIQUE
        );
    ");

    // Tạo bảng `violations`
    $db->exec("
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            error_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (class_id) REFERENCES classes (id),
            FOREIGN KEY (error_id) REFERENCES error_types (id)
        );
    ");

    // Thêm dữ liệu mẫu (tùy chọn)
    $db->exec("
        INSERT OR IGNORE INTO classes (class_name) VALUES
        ('Class A'), ('Class B'), ('Class C');
    ");

    $db->exec("
        INSERT OR IGNORE INTO error_types (error_name) VALUES
        ('Late to class'), ('Forgot homework'), ('Disruptive behavior');
    ");

    echo "Database initialized successfully!";
} catch (Exception $e) {
    // Ghi lỗi vào file log
    error_log("Database error: " . $e->getMessage(), 3, __DIR__ . '/error.log');
    echo "An error occurred. Please check the logs.";
}
?>
