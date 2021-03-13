drop database if exists employee_tracker;

create database employee_tracker;

use employee_tracker;

drop table if exists department;
create table department (
	id int auto_increment,
    name varchar(30),
    primary key(id)
);
drop table if exists role;
create table role (
	id int auto_increment primary key,
    title varchar(30),
    salary decimal,
    department_id int,
    foreign key(department_id) references department(id)
);
drop table if exists employee;
create table employee (
	id int auto_increment primary key,
	first_name varchar(30),
    last_name varchar(30),
    role_id int ,
    manager_id int default null,
    foreign key(role_id) references role(id),
    foreign key(manager_id) references employee(id)
);

use employee_tracker;

insert into department (`name`)
values ('Engineer'), ('Design'), ('Financial'), ('Tester'), ('Developer');

insert into role (`title`, `salary`, `department_id`)
values 
	('Electrical', 100000.00, 1),
    ('Mechanical', 100000.00, 1),
    ('Graphic', 55000, 2),
    ('Finance', 85000, 3),
    ('Unit', 45000, 4),
	('Junior Developer', '60000.00', 5),
	('Senior Developer', '110000.00', 5);

insert into employee (`first_name`, `last_name`, `role_id`, `manager_id`)
values ('Tuan', 'Le', 7, null);

insert into employee (`first_name`, `last_name`, `role_id`, `manager_id`)
values 
	('Jimmy', 'Tran', 1, 1),
    ('Alex' , 'Chan', 2, 1),
    ('Linda' , 'Truong', 3, 2),
    ('Carlos', 'Najera', 4, 2),
	('Carlos', 'Pavon', 5, 3),
    ('Luis', 'Ramirez', 6, 3);