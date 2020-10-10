create table invoices (
	id_invoice serial PRIMARY KEY,
	invoide_pdf VARCHAR ( 50 ),
	invoice_sent BOOLEAN,
	status VARCHAR ( 50 ),
	email_sent VARCHAR ( 50 ),
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 )
	id_point_of_sale INT NOT NULL,
	foreign key (id_point_of_sale) references point_of_sales(id_point_of_sale)
);

create table stores(
	id_store serial PRIMARY KEY,
	slug VARCHAR ( 50 ),
	store_name VARCHAR ( 50 ),
	address VARCHAR ( 50 ),
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ) 
);

create table products(
	id_product serial PRIMARY KEY,
	product_name VARCHAR ( 50 ),
	description VARCHAR ( 50 ),
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ) 
);


create table point_of_sales(
	id_point_of_sale serial PRIMARY KEY,
	id_store INT NOT NULL,
	terminal_number INT NOT NULL,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_store) references stores(id_store)
);

create table sales(
	id_sale serial PRIMARY KEY,
	id_store INT NOT NULL,
	id_point_of_sale INT NOT NULL,
	id_invoice INT NOT NULL,
	externally_created BOOLEAN,
	total float,
	total_discount float,
	total_sale float,
	status VARCHAR(100),
	is_delivery BOOLEAN,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_store) references stores(id_store),
	foreign key (id_point_of_sale) references point_of_sales(id_point_of_sale),
	foreign key (id_invoice) references invoices(id_invoice)
);


create table sales_products(
	id_sale_product serial PRIMARY KEY,
	id_store INT NOT NULL,
	id_point_of_sale INT NOT NULL,
	id_sale INT NOT NULL,
	quantity INT,
	unit_price float,
	discount_percentage int,
	total_price float,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_store) references stores(id_store),
	foreign key (id_point_of_sale) references point_of_sales(id_point_of_sale),
	foreign key (id_sale) references sales(id_sale)
);

create table store_products(
	id_store_product serial primary key,
	id_store INT NOT NULL,
	id_product INT NOT NULL,
	unit_price float,
	status VARCHAR(50),
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_store) references stores(id_store),
	foreign key (id_product) references products(id_product)
);

create table product_discounts(
	id_product_discount serial primary key,
	id_product INT NOT NULL,
	minimun_quantity INT,
	discount_percentage FLOAT,
	discount_starts DATE,
	discount_ends DATE,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_product) references products(id_product)
);

create table store_product_discounts(
	id_store_product_discount serial primary key,
	id_product INT NOT NULL,
	id_store INT NOT NULL,
	minimun_quantity INT,
	discount_percentage FLOAT,
	discount_starts DATE,
	discount_ends DATE,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_product) references products(id_product),
	foreign key (id_store) references stores(id_store)
);

create table product_discount_coupons(
	id_product_discount_coupon serial primary key,
	id_product INT NOT NULL,
	available_coupons INT,
	discount_percentage FLOAT,
	discount_starts DATE,
	discount_ends DATE,
	created_at DATE,
	created_by VARCHAR ( 50 ),
	updated_at DATE,
	updated_by VARCHAR ( 50 ),
	foreign key (id_product) references products(id_product)
);

