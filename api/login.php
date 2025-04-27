<?php
session_start();
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

$file_path = "../database/users.txt";

// Kiểm tra tệp users.txt có tồn tại không
if (!file_exists($file_path)) {
    echo json_encode(['success' => false, 'message' => 'User database not found.']);
    exit;
}

// Đọc tệp users.txt
$lines = file($file_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$user_found = false;

foreach ($lines as $line) {
    // Tách thông tin từ dòng
    list($stored_username, $stored_password, $stored_role) = explode(":", $line);

    // Kiểm tra thông tin đăng nhập
    if ($stored_username === $username && $stored_password === $password) {
        $_SESSION['isLoggedIn'] = true;
        $_SESSION['role'] = strtolower(trim($stored_role)); // Đảm bảo role là chữ thường
        $user_found = true;

        echo json_encode(['success' => true, 'role' => strtolower(trim($stored_role))]);
        break;
    }
}

// Nếu không tìm thấy tài khoản
if (!$user_found) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}
?>
