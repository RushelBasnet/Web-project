<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');
$action=$_POST['action']??'';
if($action==='get_all'){
    $stmt=$pdo->prepare("SELECT * FROM properties");
    $stmt->execute();
    $properties= $stmt->fetchALL(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "properties" => $properties]);
}
elseif($action==='get_one'){
    $id = $_GET['id'] ?? '';//First fetching the id from the user
    $stmt=$pdo->prepare("SELECT * From properties where id=?");
    $stmt->execute([$id]);
    $properties=$stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["success"=>true,"properties"=>$properties]);
}
elseif($action === 'add_property') {
    $title = trim($_POST['title'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $price = $_POST['price'] ?? '';
    $type = $_POST['type'] ?? '';
    $beds = (int)($_POST['beds'] ?? 0);
    $baths = (int)($_POST['baths'] ?? 1);
    $sqft = (int)($_POST['sqft'] ?? 0);
    $description = trim($_POST['description'] ?? '');
    $available = trim($_POST['available'] ?? '');
    $landlord = trim($_POST['landlord'] ?? '');
    $landlord_initial = trim($_POST['landlord_initial'] ?? '');
    $user_id = (int)($_POST['user_id'] ?? 0);

    // Convert JSON arrays to PostgreSQL arrays
    $amenities_raw = json_decode($_POST['amenities'] ?? '[]');
    $images_raw = json_decode($_POST['images'] ?? '[]');
    $amenities = '{' . implode(',', $amenities_raw) . '}';
    $images = '{' . implode(',', array_map(fn($i) => '"'.$i.'"', $images_raw)) . '}';

    if(!$title || !$location || !$city || !$price || !$type) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }
$stmt = $pdo->prepare("INSERT INTO properties(title, location, city, price, type, beds, baths, sqft, description, available, amenities, images, landlord, landlord_initial, user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
$stmt->execute([$title, $location, $city, $price, $type, $beds, $baths, $sqft, $description, $available, $amenities, $images, $landlord, $landlord_initial, $user_id]);
    echo json_encode(["success" => true, "message" => "Property listed successfully"]);
}
elseif($action === 'update_property') {
    $id = (int)($_POST['id'] ?? 0);
    $title = trim($_POST['title'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $price = $_POST['price'] ?? '';
    $type = $_POST['type'] ?? '';
    $beds = (int)($_POST['beds'] ?? 0);
    $baths = (int)($_POST['baths'] ?? 1);
    $sqft = (int)($_POST['sqft'] ?? 0);
    $description = trim($_POST['description'] ?? '');
    $available = trim($_POST['available'] ?? '');
    $user_id = (int)($_POST['user_id'] ?? 0);

    $amenities_raw = json_decode($_POST['amenities'] ?? '[]');
    $images_raw = json_decode($_POST['images'] ?? '[]');
    $amenities = '{' . implode(',', $amenities_raw) . '}';
    $images = '{' . implode(',', array_map(fn($i) => '"'.$i.'"', $images_raw)) . '}';

    if(!$id || !$title || !$location || !$city || !$price || !$type) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE properties SET title=?, location=?, city=?, price=?, type=?, beds=?, baths=?, sqft=?, description=?, available=?, amenities=?, images=? WHERE id=? AND user_id=?");
    $stmt->execute([$title, $location, $city, $price, $type, $beds, $baths, $sqft, $description, $available, $amenities, $images, $id, $user_id]);
    echo json_encode(["success" => true, "message" => "Property updated successfully"]);
}
elseif($action === 'get_my_listings') {
    $user_id = (int)($_POST['user_id'] ?? 0);
    if(!$user_id) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT * FROM properties WHERE user_id = ? AND status = 'active'");
    $stmt->execute([$user_id]);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "properties" => $properties]);
}
elseif($action === 'archive_property') {
    $id = (int)($_POST['id'] ?? 0);
    $user_id = (int)($_POST['user_id'] ?? 0);
    $stmt = $pdo->prepare("UPDATE properties SET status = 'archived' WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);
    echo json_encode(["success" => true, "message" => "Property archived"]);
}
elseif($action === 'delete_property') {
    $id = (int)($_POST['id'] ?? 0);
    $user_id = (int)($_POST['user_id'] ?? 0);
    $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);
    echo json_encode(["success" => true, "message" => "Property deleted"]);
}
else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>
