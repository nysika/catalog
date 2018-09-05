<?php

class Category{

    // database connection and table name
    private $conn;
    private $table_name = "categories";

    // object properties
    public $id;
    public $name;
    public $description;
    public $created;

    public function __construct($db){
        $this->conn = $db;
    }

    // used by select drop-down list
    public function readAll(){
        //select all data
        $query = "SELECT
                    id, name, description
                FROM
                    " . $this->table_name . "
                ORDER BY
                    name";

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();

        return $stmt;
    }
    // used by select drop-down list
    public function read(){

        //select all data
        $query = "SELECT
                id, name, description
            FROM
                " . $this->table_name . "
            ORDER BY
                name";

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();

        return $stmt;
    }
    public function getCategoryName(){

        //select all data
        $query = "SELECT
                name
            FROM
                " . $this->table_name . " 
            WHERE
                id = ?                 
            LIMIT
            0,1";

        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['name'];

    }
    public function getProductCategories($product_id) {
        $query = "SELECT
            c.name as category_name, c.id as category_id
        FROM
          " . $this->table_name . " c           
        INNER JOIN
          product_has_category p
        ON 
          p.category_id = c.id
        WHERE
          p.product_id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $product_id);
        $stmt->execute();
        $categories = [];
        while ($category = $stmt->fetch(PDO::FETCH_ASSOC)){

            array_push($categories, $category);
        }
        return $categories;

    }
    
}

?>