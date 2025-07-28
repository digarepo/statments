
CREATE TABLE IF NOT EXISTS deposits (
    dp_id VARCHAR(6) PRIMARY KEY, 
    amount REAL NOT NULL,         
    deposit_date DATETIME NOT NULL    
);

