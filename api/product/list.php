<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/product.php';
include_once '../objects/category.php';


// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$product = new Product($db);
$product->category_id = isset($_GET['cat_id']) ? $_GET['cat_id'] : 0;
// query products
$stmt = $product->read();
$num = $stmt->rowCount();
$category = new Category($db);


// check if more than 0 record found
if($num>0){

    // products array
    $products_arr=array();
    $products_arr["records"]=array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        extract($row);
        $product_item=array(
            "id" => (int)$id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "price" => (int)$price,
            "categories"=>$category->getProductCategories((int)$id)
        );

        array_push($products_arr["records"], $product_item);
    }
    if ($product->category_id>0) {
        $category->id = $product->category_id;
        $products_arr["title"]=$category->getCategoryName();
    }
    else {
        $products_arr["title"]='Products';
    }


    echo json_encode($products_arr);
}

else{
    echo json_encode(
        array("message" => "No products found.")
    );
}
?>