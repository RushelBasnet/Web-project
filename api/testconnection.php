<?php
// /api/test-connection.php
$pdo = require __DIR__ . '/db.php';   // ✅ only once, and capture the returned PDO

try {
    $stmt = $pdo->query("SELECT 'Connected to Supabase!' as message, NOW() as time");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $result]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>