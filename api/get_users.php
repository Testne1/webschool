<?php
// File chứa danh sách tài khoản
$file = '../database/users.txt';

if (file_exists($file)) {
    $users = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $userList = [];

    foreach ($users as $user) {
        // Tách username và password
        $parts = explode(":", $user);

        // Kiểm tra xem có đủ hai phần tử hay không
        if (count($parts) >= 2) {
            $username = trim($parts[0]);
            $userList[] = ['username' => $username];
        }
    }

    echo json_encode(['success' => true, 'users' => $userList]);
} else {
    echo json_encode(['success' => false, 'message' => 'File not found.']);
}
?>
