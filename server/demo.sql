INSERT INTO user (id, name, email, password) VALUES (1, "Admin",   "admin@test.com",   "123456");
INSERT INTO user (id, name, email, password) VALUES (2, "Manager", "manager@test.com", "123456");
INSERT INTO user (id, name, email, password) VALUES (3, "User",    "user@test.com",    "123456");

INSERT INTO role (id, name) VALUES (1, "ADMIN");
INSERT INTO role (id, name) VALUES (2, "MANAGER");
INSERT INTO role (id, name) VALUES (3, "USER");

INSERT INTO user_role (userId, roleId) VALUES (1, 1);
INSERT INTO user_role (userId, roleId) VALUES (1, 2);
INSERT INTO user_role (userId, roleId) VALUES (1, 3);
INSERT INTO user_role (userId, roleId) VALUES (2, 2);
INSERT INTO user_role (userId, roleId) VALUES (2, 3);
INSERT INTO user_role (userId, roleId) VALUES (3, 3);


