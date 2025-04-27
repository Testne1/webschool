<?php
$file = '../database/recorded_violations.txt';
$backupFile = '../database/violations_backup_' . date('Y-m-d_H-i-s') . '.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (file_exists($file)) {
        // Tạo file sao lưu
        if (!copy($file, $backupFile)) {
            echo json_encode(['success' => false, 'message' => 'Failed to create backup.']);
            exit;
        }

        // Đặt lại file lỗi
        if (file_put_contents($file, '') !== false) {
            // Xóa file sao lưu sau khi tải thành công
            if (file_exists($backupFile)) {
                unlink($backupFile);
            }
            echo json_encode(['success' => true, 'message' => 'File reset and backup deleted.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to reset the file.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File does not exist.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
