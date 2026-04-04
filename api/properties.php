<?php
header("Access-Control-Allow-Origin:*");
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
elseif($action==='add_property'){
    $title=trim($_POST['title']??'');
    $location=trim($_POST['location']??'');
    $city=trim($_POST['city']??'');
    $price=($_POST['price']??'');
    $type=($_POST['type']??'');
    if(!$title|| !$location||!$city||!$price||!$type){
        echo json_encode(["success"=>false,"message"=>"Missing Required Fields"]);
        exit;
    }
    $stmt=$pdo->prepare("INSERT INTO properties( title, location, city, price, type)VALUES (?,?,?,?,?)");
    $stmt->execute([$title, $location, $city, $price, $type]);
    echo json_encode(["success" => true, "message" => "Success"]);
}
else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>
