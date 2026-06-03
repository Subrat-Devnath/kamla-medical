CREATE KEYSPACE main_db WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE product (
    organization_id  text,
    product_name  text,
    product_quantity bigint,
    category      text,
    is_deleted    boolean,
    is_expired    boolean,
    expiry_date   bigint,
    created_date   bigint,
    created_user_name   text,
    created_user_id   text,
    updated_date   bigint,
    updated_user_name   text,
    updated_user_id   text,
    PRIMARY KEY ((organization_id), product_name)
);