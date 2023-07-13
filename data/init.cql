CREATE KEYSPACE product_space
  WITH replication = {
    'class': 'SimpleStrategy', -- This may need to be changed to NetworkTopologyStrategy for scaling/production
    'replication_factor': 3
  };

USE product_space;

CREATE TABLE product_by_id (
  product_id int,
  name text,
  slogan text,
  description text,
  category text,
  default_price float,
  default_style_id int,
  PRIMARY KEY (product_id)
);

CREATE TABLE features_by_product (
  product_id int,
  feature text,
  value text,
  PRIMARY KEY (product_id, feature)
);

CREATE TABLE related_by_product (
  product_id int,
  related_id int,
  PRIMARY KEY (product_id, related_id)
);

CREATE TABLE styles_by_product (
  product_id int,
  style_id int,
  name text,
  original_price float,
  sale_price float,
  PRIMARY KEY (product_id, name, style_id)
);

CREATE TABLE skus_by_style (
  style_id int,
  sku text,
  quantity int,
  size text,
  PRIMARY KEY (style_id, sku)
);

CREATE TABLE photos_by_style (
  style_id int,
  thumbnail_url text,
  url text,
  PRIMARY KEY (style_id, url)
);