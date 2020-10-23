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