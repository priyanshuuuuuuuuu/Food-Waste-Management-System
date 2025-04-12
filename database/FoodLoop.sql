CREATE DATABASE FoodLoop;
USE FoodLoop;

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('FoodProvider', 'Transporter', 'Company') NOT NULL,
    phone_number VARCHAR(100),
    address VARCHAR(255),
    email VARCHAR(100)
);

CREATE TABLE Provider (
    provider_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_name VARCHAR (100),
    user_id INT NOT NULL,
    business_type ENUM('Restaurant', 'Hotel', 'Canteen', 'Catering Service', 'Other') NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    upcoming_pickups INT DEFAULT 0,
    waste_this_month INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Listing (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    quantity VARCHAR(100),
    foodtype ENUM(
        'Vegetable Scraps',
        'Fruit Peels',
        'Used Cooking Oil',
        'Grains & Starches',
        'Dairy Products',
        'Mixed Food Waste'
    ) NOT NULL,
    listed_date DATE,
    best_before DATE,
    provider_id INT NOT NULL,
    num_of_interest_companies INT DEFAULT 0,
    status ENUM('Active', 'Deleted', 'Expired') DEFAULT 'Active',
    FOREIGN KEY (provider_id) REFERENCES Provider(provider_id)
);

CREATE TABLE Transporter (
    transporter_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    fleet_size ENUM('1-5 vehicles', '6-20 vehicles', '21+ vehicles') NOT NULL,
    gst_number VARCHAR(15) UNIQUE NOT NULL,
    rating FLOAT DEFAULT 0,
    pending_pickups INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    contact_person_name VARCHAR(100) NOT NULL,
    industry_type ENUM(
        'Biogas Production', 
        'Composting', 
        'Animal Feed', 
        'Biofuel Production', 
        'Other'
    ) NOT NULL,
    waste_types_accepted ENUM(
        'All Food Waste', 
        'Organic Waste Only', 
        'Cooking Oils', 
        'Grains and Cereals', 
        'Mixed Food Waste'
    ) NOT NULL,
    upcoming_deliveries INT DEFAULT 0,
    rating FLOAT DEFAULT 0,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);