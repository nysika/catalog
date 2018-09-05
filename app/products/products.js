$(document).ready(function(){

    // show list of product on first load
    showProducts();
    $('#page-content').on('click', '.read-products-button', function(){
        showProducts();
    });
    $('#page-content').on('click', '.create-product-button', function(){
        productForm('create',0);

    });
    $('#page-content').on('submit', '#create-product-form', function(){

        createProduct($(this))
        return false;

    });
    $('#page-content').on('submit', '#update-product-form', function(){

        updateProduct($(this))
        return false;

    });
    $('#page-content').on('click', '.read-one-product-button', function(){
        // get product id
        var id = $(this).attr('data-id');

        viewProduct(id);


    });
    $('#page-content').on('click', '.update-product-button', function(){
        // product ID will be here
        // get product id
        var id = $(this).attr('data-id');
        productForm('update',id);
        //updateProduct(id);
    });
    $('#page-content').on('click', '.delete-product-button', function(){
        // product id will be here
        var id = $(this).attr('data-id');
        deleteProduct(id);

    });

    $('#page-content').on('click', '.products-by-category', function(){

        // get form data will be here
        var id = $(this).attr('data-id');
        getProductsByCategory(id)
        return false;
    });



});

// will run if create product form was submitted

// function to show list of products
function showProducts(cat_id=0) {
// get list of products from the API
    if (cat_id>0) {
        var query="?cat_id="+cat_id;
    }
    else {
        var query="";
    }
    $.getJSON("/api/product/list.php"+query, function (data) {
        // html for listing products
        var read_products_html = "";

// when clicked, it will load the create product form
        read_products_html+=" <div id='read-products' class='btn btn-primary pull-left m-b-15px read-products-button'>";
        read_products_html+="<span class='glyphicon glyphicon-list'></span> All Products";
        read_products_html+="</div>";
        read_products_html += "<div id='create-product' class='btn btn-primary pull-right m-b-15px create-product-button'>";
        read_products_html += "<span class='glyphicon glyphicon-plus'></span> Create Product";
        read_products_html += "</div>";
        // start table
        read_products_html += "<table class='table table-bordered table-hover'>";

        // creating our table heading
        read_products_html += "<tr>";
        read_products_html += "<th class='w-25-pct'>Name</th>";
        read_products_html += "<th class='w-10-pct'>Price</th>";
        read_products_html += "<th class='w-15-pct'>Categories</th>";
        read_products_html += "<th class='w-25-pct text-align-center'>Action</th>";
        read_products_html += "</tr>";

        // loop through returned list of data
        $.each(data.records, function (key, val) {

            // creating new table row per record
            read_products_html += "<tr>";

            read_products_html += "<td>" + val.name + "</td>";
            read_products_html += "<td>" + val.price + " <span class='glyphicon glyphicon-ruble'></span></td>";
            read_products_html += "<td>";
            $.each(val.categories, function (key, value) {
                read_products_html +=  "<a href='#' class='products-by-category' data-id='" + value.category_id + "'>" + value.category_name + "</a> | ";
            });
            read_products_html += "</td>";


            // 'action' buttons
            read_products_html += "<td>";
            // read one product button
            read_products_html += "<button class='btn btn-primary m-r-10px read-one-product-button' data-id='" + val.id + "'>";
            read_products_html += "<span class='glyphicon glyphicon-eye-open'></span> View";
            read_products_html += "</button>";

            // edit button
            read_products_html += "<button class='btn btn-info m-r-10px update-product-button' data-id='" + val.id + "'>";
            read_products_html += "<span class='glyphicon glyphicon-edit'></span> Edit";
            read_products_html += "</button>";

            // delete button
            read_products_html += "<button class='btn btn-danger delete-product-button' data-id='" + val.id + "'>";
            read_products_html += "<span class='glyphicon glyphicon-remove'></span> Delete";
            read_products_html += "</button>";
            read_products_html += "</td>";

            read_products_html += "</tr>";

        });

// end table
        read_products_html += "</table>";
        // inject to 'page-content' of our app
        $("#page-content").html(read_products_html);
        // chage page title
        changePageTitle(data.title);

    });
}
function categoryOptions(categories="") {
    var categories_options_html = "";
    cat_ids=[];
    if (categories) {

        $.each(categories, function (key, val) {

            cat_ids.push(val.category_id);
        });


    }

    $.ajax({
        async: false,
        url: "/api/category/list.php",
        // data: {data},
        dataType: "json",
        success: function (data) {
            //result = data;
            var checked="";
            $.each(data.records, function (key, val) {
                if ($.inArray( val.id, cat_ids )!=-1) {
                    checked=" checked";

                }
                else {
                    checked="";
                }
                categories_options_html += "<input name='categories' type='checkbox' value='" + val.id + "'"+checked+"> " + val.name + "<br>";
            });
        }
    });
    return categories_options_html;


}
function Product(id) {
var result="";
    $.ajax({
        async: false,
        url: "/api/product/view.php",
        data: {"id":id},
        dataType: "json",
        success: function (data) {

          result = data;

        }
    });

return result;
}
function productForm(action,id) {
        var title;
        var categories;
        var css;
        var description;
        var name;
        var price;
        var id_input;

        if (id>0) {
            var product=Product(id);

            categories=categoryOptions(product.categories);
            css="update";
            description=product.description;
            name=product.name;
            price=product.price;
            title = "Update Product";
            id_input="<input value='"+product.id+"' type='hidden' name='id' class='form-control' />";

        }
        else {
            title = "Create Product";
            categories=categoryOptions();
            css="create";
            description="";
            name="";
            price="";
            id_input="";

        }
        var create_product_html = "";

// 'read products' button to show list of products
        create_product_html += "<div class='message pull-left'>";
        create_product_html += "<span></span>";
        create_product_html += "</div>";
        create_product_html += "<div id='read-products' class='btn btn-primary pull-right m-b-15px read-products-button'>";
        create_product_html += "<span class='glyphicon glyphicon-list'></span> View Products";
        create_product_html += "</div>";
        // 'create product' html form
        create_product_html += "<form id='"+css+"-product-form' method='POST' action='/' border='0'>";
        create_product_html += "<table class='table table-hover table-responsive table-bordered'>";

        // name field
        create_product_html += "<tr>";
        create_product_html += "<td>Name</td>";
        create_product_html += "<td><input value='"+name+"' type='text' name='name' class='form-control' required /></td>";
        create_product_html += "</tr>";

        // price field
        create_product_html += "<tr>";
        create_product_html += "<td>Price</td>";
        create_product_html += "<td><input value='"+price+"' type='number' min='1' name='price' class='form-control' required /></td>";
        create_product_html += "</tr>";

        // description field
        create_product_html += "<tr>";
        create_product_html += "<td>Description</td>";
        create_product_html += "<td><textarea name='description' class='form-control' required>"+description+"</textarea></td>";
        create_product_html += "</tr>";

        // categories 'select' field
        create_product_html += "<tr>";
        create_product_html += "<td>Category</td>";
        create_product_html += "<td>" + categories + "</td>";
        create_product_html += "</tr>";

        // button to submit form
        create_product_html += "<tr>";
        create_product_html += "<td></td>";
        create_product_html += "<td>";
        create_product_html += id_input;
        create_product_html += "<button class='btn btn-primary'>";
        create_product_html += "<span class='glyphicon glyphicon-plus'></span> "+title;
        create_product_html += "</button>";
        create_product_html += "</td>";
        create_product_html += "</tr>";

        create_product_html += "</table>";
        create_product_html += "</form>";
        // inject html to 'page-content' of our app
        $("#page-content").html(create_product_html);
        changePageTitle(title);

// chage page title



}

function createProduct(form) {

    var form_data=JSON.stringify(form.serializeObject());
    // console.log(form_data);
    // submit form data to api

    $.ajax({
        url: "/api/product/create.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // product was created, go back to products list
            // console.log(result);
            $('#page-content .message').html(result.message);
            showProducts();
        },
        error: function(xhr, resp, text) {
            // show error to console
            console.log(xhr, resp, text);
        }
    });

}
function updateProduct(form) {
    var form_data=JSON.stringify(form.serializeObject());
    console.log(form_data);
    // submit form data to api

    $.ajax({
        url: "/api/product/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // product was created, go back to products list
            $('#page-content .message').html(result.message);
            //showProducts();
        },
        error: function(xhr, resp, text) {
            // show error to console
            console.log(xhr, resp, text);
        }
    });
}
function viewProduct(id) {
    // read product record based on given ID
    $.getJSON("/api/product/view.php?id=" + id, function(data){
        // start html
        var read_one_product_html="";

// when clicked, it will show the product's list
        read_one_product_html+="<div id='read-products' class='btn btn-primary pull-right m-b-15px read-products-button'>";
        read_one_product_html+="<span class='glyphicon glyphicon-list'></span> View All Products";
        read_one_product_html+="</div>";
        // product data will be shown in this table
        read_one_product_html+="<table class='table table-bordered table-hover'>";

        // product name
        read_one_product_html+="<tr>";
        read_one_product_html+="<td class='w-30-pct'>Name</td>";
        read_one_product_html+="<td class='w-70-pct'>" + data.name + "</td>";
        read_one_product_html+="</tr>";

        // product price
        read_one_product_html+="<tr>";
        read_one_product_html+="<td>Price</td>";
        read_one_product_html+="<td>" + data.price + "</td>";
        read_one_product_html+="</tr>";

        // product description
        read_one_product_html+="<tr>";
        read_one_product_html+="<td>Description</td>";
        read_one_product_html+="<td>" + data.description + "</td>";
        read_one_product_html+="</tr>";

        // product category name
        read_one_product_html+="<tr>";
        read_one_product_html+="<td>Category</td>";
        read_one_product_html+="<td>";
        $.each(data.categories, function (key, value) {
            read_one_product_html +=  "" + value.category_name + " | ";
        });
        read_one_product_html+="</td>";
        read_one_product_html+="</tr>";

        read_one_product_html+="</table>";
        // inject html to 'page-content' of our app
        $("#page-content").html(read_one_product_html);

// chage page title
        changePageTitle("Product " + data.name);
    });
}


function deleteProduct(id) {
    // bootbox for good looking 'confirm pop up'
    bootbox.confirm({

        message: "<h4>Are you sure?</h4>",
        buttons: {
            confirm: {
                label: '<span class="glyphicon glyphicon-ok"></span> Yes',
                className: 'btn-danger'
            },
            cancel: {
                label: '<span class="glyphicon glyphicon-remove"></span> No',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            if(result==true){

                // send delete request to api / remote server
                $.ajax({
                    url: "/api/product/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ id: id }),
                    success : function(result) {

                        // re-load list of products
                        showProducts();
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                    }
                });

            }
        }
    });



}
function  getProductsByCategory(id) {
    showProducts(id);
}
