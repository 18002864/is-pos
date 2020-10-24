create table sales(
	id_sale serial PRIMARY KEY,
	id_bodega INT NOT NULL,
	massive_sale_id INT,
	customer_id varchar(20),
	total_sale float,	
	total_discount float,
	created_at DATE,
	created_by VARCHAR ( 50 )
); 

create table sales_products(
	id_sale_product serial PRIMARY KEY,
	id_sale INT NOT NULL,		
	id_bodega INT NOT NULL,
	sku varchar(12),
	quantity INT,
	unit_price float,
	discount_percentage int,
	total_product float,
	total_discount float,
	total float,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	foreign key (id_sale) references sales(id_sale)
);


-- hacer post a la ruta del mamarre
-- https://inventarios-is.herokuapp.com/pos/7/external-sales
-- cuando ocurra el insert en este endpoint debo de insertar los valores en sales
-- {
--   "massive_sale_id": 12345,
--   "customer_id": 20,
--   "total_sale": 69.25,
--   "total_discount": 10.75,
--   "products": [
--     {
--       "product_code": "JU_NAR_1LI",
--       "quantity": 10,
--       "unit_price": 5.5,
--       "discount_percentage": 15,
--       "total_product": 55,
--       "total_discount": 8.25,
--       "total": 46.75
--     },
--     {
--       "product_code": "JU_NAR_500ML",
--       "quantity": 10,
--       "unit_price": 2.5,
--       "discount_percentage": 10,
--       "total_product": 25,
--       "total_discount": 2.5,
--       "total": 22.5
--     }
--   ]
-- }