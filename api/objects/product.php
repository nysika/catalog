<?php

class Product
{

    // database connection and table name
    private $conn;
    private $table_name = "products";


    // object properties
    public $id;
    public $name;
    public $description;
    public $price;
    public $created;
    public $categories;

    //more methods



    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;

    }
    function validate() {
        if ($this->name && $this->description && $this->price) {
            return true;
        }
        else {
            return false;
        }
    }
    function read()
    {

        // select all query
        $query = "SELECT
            p.id, p.name, p.description, p.price, p.created
        FROM
            " . $this->table_name . " p";

        if ($this->category_id>0) {
            $query .= " INNER JOIN 
                product_has_category phc 
            ON 
                p.id=phc.product_id  
            WHERE 
                phc.category_id = :category_id";
        }
        $query .= " ORDER BY
            p.created DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);
        if ($this->category_id>0) {
            $this->category_id=htmlspecialchars(strip_tags($this->category_id));
            $stmt->bindParam(":category_id", $this->category_id);
        }

        // execute query
        $stmt->execute();
        return $stmt;
    }


    function readOne()
    {

        // query to read single record
        $query = "SELECT
            p.id, p.name, p.description, p.price, p.created
        FROM
            " . $this->table_name . " p
            
        WHERE
            p.id = ?
        LIMIT
            0,1";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->name = $row['name'];
        $this->price = $row['price'];
        $this->description = $row['description'];
    }

    // create product
    function create(){

        // query to insert record

        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                name=:name, price=:price, description=:description, created=:created";


        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->price=htmlspecialchars(strip_tags($this->price));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->created=htmlspecialchars(strip_tags($this->created));

        // bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":created", $this->created);

        // execute query
        if($stmt->execute()){

           $this->saveProductCategories($this->conn->lastInsertId(), $this->categories);
           return true;

           // }

        }

        return false;

    }

    // update product
    function update()
    {

        // update query
        $query = "UPDATE
            " . $this->table_name . "
        SET
            name = :name,
            price = :price,
            description = :description
        WHERE
            id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if ($stmt->execute()) {
            $this->removeProductCategories($this->id);
            $this->saveProductCategories($this->id, $this->categories);
            return true;
        }

        return false;
    }

    // delete product
    function delete()
    {

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;

    }

    public function saveProductCategories($product_id, $categories) {
        $query="INSERT INTO
          product_has_category (product_id, category_id) VALUES ";
        if (is_array($categories)) {
            $i=1;
            foreach ($categories as $category) {
                $query .= "(".$product_id.", ".$category." )";
                if ($i<count($categories)) {
                    $query .= ", ";
                    $i++;
                }

            }
        }
        else {
            $query .= "(".$product_id.", ".$categories." )";
        }


        $stmt = $this->conn->prepare($query);

        if($stmt->execute()){
            return true;
        }

        return false;
      // echo $query;

    }

    public function removeProductCategories($product_id) {
        $query="DELETE FROM
          product_has_category 
          WHERE
            product_id = :id";


        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $product_id);
        if($stmt->execute()){
            return true;
        }

        return false;
        // echo $query;

    }

    public function readPaging($from_record_num, $records_per_page)
    {

        // select query
        $query = "SELECT
            c.name as category_name, p.id, p.name, p.description, p.price, p.category_id, p.created
        FROM
            " . $this->table_name . " p
            LEFT JOIN
                categories c
                    ON p.category_id = c.id
        ORDER BY p.created DESC
        LIMIT ?, ?";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        // return values from database
        return $stmt;
    }

    // used for paging products
    public function count()
    {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }



}
