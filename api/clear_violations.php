<?php
$file = '../database/recorded_violations.txt';
//$backupFile = '../database/violations_backup_' . date('Y-m-d_H-i-s') . '.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (file_exists($file)) {
        // Tạo file sao lưu
        //if (!copy($file, $backupFile)) {
            //echo json_encode(['success' => false, 'message' => 'Failed to create backup.']);
            //exit;
        //}

        // Đặt lại file lỗi
        if (file_put_contents($file, '') !== false) {
            echo json_encode([
                'success' => true,
                'message' => 'Violations reset successfully.',
                //'backupFile' => basename($backupFile),
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to reset violations.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No violations to reset.']);
    }
}
?>
