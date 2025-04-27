<?php
function connectDatabase() {
    try {
        $db = new PDO('sqlite:../database/school_management.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}
?>
