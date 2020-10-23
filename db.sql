create table product_discount(
	id_discount serial primary key,  
	id_bodega   int not null,
	sku         varchar(12),
	starts      date,
	ends        date 
);

create table sales(
	id_sale serial PRIMARY KEY,
	id_bodega INT NOT NULL,
	total float,
	total_discount float,
	total_sale float,
	status VARCHAR(100),
	created_at DATE,
	created_by VARCHAR ( 50 )
); 

create table sales_products(
	id_sale_product serial PRIMARY KEY,
	id_sale INT NOT NULL,		
	id_bodega INT NOT NULL,
	quantity INT,
	unit_price float,
	discount_percentage int,
	total_price float,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	foreign key (id_sale) references sales(id_sale)
);