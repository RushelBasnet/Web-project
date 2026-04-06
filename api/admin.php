<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$action = $_POST['action'] ?? '';

// Verify admin role for all actions
function verifyAdmin($pdo, $user_id) {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user && $user['role'] === 'admin';
}

$user_id = (int)($_POST['user_id'] ?? 0);
if (!$user_id || !verifyAdmin($pdo, $user_id)) {
    echo json_encode(["success" => false, "message" => "Unauthorized: Admin access required"]);
    exit;
}

// ===========================
// DASHBOARD STATS
// ===========================
if ($action === 'get_stats') {
    $totalProperties = $pdo->query("SELECT COUNT(*) FROM properties")->fetchColumn();
    $activeProperties = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'active'")->fetchColumn();
    $archivedProperties = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'archived'")->fetchColumn();
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

    echo json_encode([
        "success" => true,
        "stats" => [
            "total_properties" => (int)$totalProperties,
            "active_properties" => (int)$activeProperties,
            "archived_properties" => (int)$archivedProperties,
            "total_users" => (int)$totalUsers
        ]
    ]);
}

// ===========================
// MANAGE PROPERTIES
// ===========================
elseif ($action === 'get_all_properties') {
    $stmt = $pdo->prepare("SELECT p.*, u.name as owner_name, u.email as owner_email FROM properties p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.id DESC");
    $stmt->execute();
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "properties" => $properties]);
}

elseif ($action === 'update_property_status') {
    $prop_id = (int)($_POST['property_id'] ?? 0);
    $status = $_POST['status'] ?? '';
    $allowed = ['active', 'archived', 'pending', 'rejected'];
    if (!in_array($status, $allowed)) {
        echo json_encode(["success" => false, "message" => "Invalid status"]);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE properties SET status = ? WHERE id = ?");
    $stmt->execute([$status, $prop_id]);
    echo json_encode(["success" => true, "message" => "Property status updated to $status"]);
}

elseif ($action === 'toggle_featured') {
    $prop_id = (int)($_POST['property_id'] ?? 0);
    $stmt = $pdo->prepare("SELECT badge FROM properties WHERE id = ?");
    $stmt->execute([$prop_id]);
    $prop = $stmt->fetch(PDO::FETCH_ASSOC);
    $newBadge = ($prop && $prop['badge'] === 'featured') ? null : 'featured';
    $stmt = $pdo->prepare("UPDATE properties SET badge = ? WHERE id = ?");
    $stmt->execute([$newBadge, $prop_id]);
    echo json_encode(["success" => true, "message" => $newBadge ? "Property marked as featured" : "Featured badge removed"]);
}

elseif ($action === 'admin_delete_property') {
    $prop_id = (int)($_POST['property_id'] ?? 0);
    $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
    $stmt->execute([$prop_id]);
    echo json_encode(["success" => true, "message" => "Property deleted permanently"]);
}

// ===========================
// MANAGE USERS
// ===========================
elseif ($action === 'get_all_users') {
    $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get property count per user
    foreach ($users as &$u) {
        $stmt2 = $pdo->prepare("SELECT COUNT(*) FROM properties WHERE user_id = ?");
        $stmt2->execute([$u['id']]);
        $u['property_count'] = (int)$stmt2->fetchColumn();
    }

    echo json_encode(["success" => true, "users" => $users]);
}

elseif ($action === 'update_user_role') {
    $target_id = (int)($_POST['target_user_id'] ?? 0);
    $role = $_POST['role'] ?? '';
    $allowed = ['user', 'admin', 'banned'];
    if (!in_array($role, $allowed)) {
        echo json_encode(["success" => false, "message" => "Invalid role"]);
        exit;
    }
    if ($target_id === $user_id && $role !== 'admin') {
        echo json_encode(["success" => false, "message" => "Cannot remove your own admin role"]);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->execute([$role, $target_id]);
    echo json_encode(["success" => true, "message" => "User role updated to $role"]);
}

elseif ($action === 'delete_user') {
    $target_id = (int)($_POST['target_user_id'] ?? 0);
    if ($target_id === $user_id) {
        echo json_encode(["success" => false, "message" => "Cannot delete your own account"]);
        exit;
    }
    // Delete user's properties first
    $stmt = $pdo->prepare("DELETE FROM properties WHERE user_id = ?");
    $stmt->execute([$target_id]);
    // Delete the user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$target_id]);
    echo json_encode(["success" => true, "message" => "User and their properties deleted"]);
}

else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>
