INSERT INTO user (id, name, email, password) VALUES (1, "Admin",   "admin@test.com",   "123456");
INSERT INTO user (id, name, email, password) VALUES (2, "Manager", "manager@test.com", "123456");
INSERT INTO user (id, name, email, password) VALUES (3, "User1",    "user1@test.com",    "123456");
INSERT INTO user (id, name, email, password) VALUES (4, "User2",    "user2@test.com",    "123456");
INSERT INTO user (id, name, email, password) VALUES (5, "User3",    "user3@test.com",    "123456");

INSERT INTO role (id, name) VALUES (1, "ADMIN");
INSERT INTO role (id, name) VALUES (2, "MANAGER");
INSERT INTO role (id, name) VALUES (3, "USER");

INSERT INTO user_role (userId, roleId) VALUES (1, 1);
INSERT INTO user_role (userId, roleId) VALUES (1, 2);
INSERT INTO user_role (userId, roleId) VALUES (1, 3);
INSERT INTO user_role (userId, roleId) VALUES (2, 2);
INSERT INTO user_role (userId, roleId) VALUES (2, 3);
INSERT INTO user_role (userId, roleId) VALUES (3, 3);
INSERT INTO user_role (userId, roleId) VALUES (4, 3);
INSERT INTO user_role (userId, roleId) VALUES (5, 3);

INSERT INTO event (id, name, date_begin, date_end, price, tickets_count) VALUES (1, 'Event1', '2019-01-01 10:00:00', '2019-01-01 12:00:00', 100, 50);
INSERT INTO event (id, name, date_begin, date_end, price, tickets_count) VALUES (2, 'Event2', '2019-03-01 20:00:00', '2019-03-01 21:00:00', 150, 20);
INSERT INTO event (id, name, date_begin, date_end, price, tickets_count) VALUES (3, 'Event3', '2019-07-15 08:00:00', '2019-07-18 18:00:00', 750, 10);
INSERT INTO event (id, name, date_begin, date_end, price, tickets_count) VALUES (4, 'Event4', '2019-08-13 16:30:00', '2019-08-13 18:30:00', 300, 15);
INSERT INTO event (id, name, date_begin, date_end, price, tickets_count) VALUES (5, 'Event5', '2019-09-20 15:00:00', '2019-09-20 16:00:00', 200, 100);

INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (1, '2019-01-01 10:00:00', 3, 2, 10);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (2, '2019-02-01 10:00:00', 3, 3, 3);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (3, '2019-03-01 10:00:00', 3, 4, 5);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (4, '2019-04-01 10:00:00', 3, 5, 2);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (5, '2019-05-01 10:00:00', 3, 1, 1);

INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (6, '2019-02-01 10:00:00', 4, 3, 3);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (7, '2019-03-01 10:00:00', 4, 4, 5);
INSERT INTO purchase (id, date, user_id, event_id, tickets_count) VALUES (8, '2019-04-01 10:00:00', 4, 5, 2);

