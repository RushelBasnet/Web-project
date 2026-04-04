<?php
// /api/db.php
$host = "aws-1-ap-southeast-1.pooler.supabase.com";
$port = "5432";
$dbname = "postgres";
$user = "postgres.yefiwfmoylmwusejtzlm";
$password = "4%KdrkUt?3Z9tUd";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    return $pdo;
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}
?>