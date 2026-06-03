CREATE TABLE refresh_token
(
    token_id       uuid,
    user_id        text,
    created_at     int,
    expired_at     int,
    revoked        boolean,
    replaced_token text,
    PRIMARY KEY ((token_id))
);