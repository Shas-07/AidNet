-- AidNet MySQL schema

-- Ensure the expected database exists and select it
CREATE DATABASE IF NOT EXISTS aidnet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aidnet;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('patient','volunteer','hospital','ngo','admin') NOT NULL DEFAULT 'patient',
  points INT NOT NULL DEFAULT 0,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  blood_group VARCHAR(3) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  last_seen TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes for donor and geo queries (idempotent)
DROP INDEX IF EXISTS idx_users_blood_group ON users;
CREATE INDEX idx_users_blood_group ON users (blood_group);
DROP INDEX IF EXISTS idx_users_geo ON users;
CREATE INDEX idx_users_geo ON users (lat, lng);

CREATE TABLE IF NOT EXISTS emergencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  lat DOUBLE NOT NULL,
  lng DOUBLE NOT NULL,
  severity ENUM('low','medium','high') NOT NULL,
  status ENUM('open','in_progress','resolved','cancelled') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS volunteer_offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emergency_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('offered','accepted','completed','cancelled') NOT NULL DEFAULT 'offered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emergency_id) REFERENCES emergencies(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS org_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  org_name VARCHAR(150) NOT NULL,
  license_id VARCHAR(120) DEFAULT NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS fundraisers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  target_amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fundraiser_id INT NOT NULL,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fundraiser_id) REFERENCES fundraisers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS action_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  details VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
