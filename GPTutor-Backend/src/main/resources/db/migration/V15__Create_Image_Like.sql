CREATE TABLE image_like
(
    id UUID NOT NULL,
    image_id UUID NOT NULL,
    vk_user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);