use employee_tracker;

create table department (
	id int auto_increment,
    name varchar(30),
    primary key(id)
);

create table role (
	id int auto_increment primary key,
    title varchar(30),
    salary decimal,
    department_id int,
    foreign key(department_id) references department(id)
);

create table employee (
	id int auto_increment primary key,
	first_name varchar(30),
    last_name varchar(30),
    rold_id int ,
    manager_id int,
    foreign key(rold_id) references role(id),
    foreign key(manager_id) references employee(id)
);