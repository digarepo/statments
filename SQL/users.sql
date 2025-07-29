
CREATE TABLE deposits (
    dp_id VARCHAR(50) PRIMARY KEY,
    deposit_date DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    depositor_name VARCHAR(100) NOT NULL,
    reconciliation VARCHAR(50),
    ref_number VARCHAR(50),
    deposit_number VARCHAR(50),
    bank_name VARCHAR(100),
    account_type VARCHAR(50),
    comment VARCHAR(255)
);

