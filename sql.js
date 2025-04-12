console.log("Hello")
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;


const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tiwari@142',
    database: 'FoodLoop'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to SQL database!");

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

// POST route for signup
app.post('/api/registerProvider', async (req, res) => {
    try {
        const {
            BusinessName,
            OwnerName,
            Phone,
            Email,
            Address,
            BusinessType,
            Password,
            ConfirmPassword
        } = req.body;

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const userSql = `INSERT INTO User 
            (name, phone_number, email, password, role, address) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        console.log(userSql);

        const userValues = [BusinessName, Phone, Email, hashedPassword, "FoodProvider", Address];

        db.query(userSql, userValues, (err, userResult) => {
            if (err) {
                console.error("Error inserting into User:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.message.includes('phone_number')) {
                        return res.status(400).json({ error: "Phone number already registered" });
                    } else if (err.message.includes('email')) {
                        return res.status(400).json({ error: "Email already registered" });
                    }
                }
                return res.status(500).json({ error: "Error registering user" });
            }

            const userId = userResult.insertId;
            console.log("Inserted user ID:", userId);

            const providerSql = `INSERT INTO Provider 
                (owner_name, user_id, business_type)
                VALUES (?, ?, ?)`;

            const providerValues = [OwnerName, userId, BusinessType];

            db.query(providerSql, providerValues, (err, providerResult) => {
                if (err) {
                    console.error("Error inserting into Provider:", err);
                    return res.status(500).json({ error: "Error registering provider details" });
                }

                res.status(200).json({ 
                    success: true,
                    message: "Registration successful",
                    redirectUrl: "providerDashboard.html"
                });
            });
        });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/registerTransporter', async (req, res) => {
    console.log("Registering transporter..."); 
    try {
        const {
            BusinessName,
            ContactPerson,
            Phone,
            Email,
            FleetSize,
            GSTNumber,
            Address,
            Password,
            ConfirmPassword
        } = req.body;

        console.log(FleetSize);

        if (!BusinessName || !ContactPerson || !Phone || !Email || !FleetSize || !GSTNumber || !Address || !Password || !ConfirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Step 1: Insert into User table
        const userSql = `
            INSERT INTO User (name, phone_number, email, password, role, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const userValues = [BusinessName, Phone, Email, hashedPassword, "Transporter", Address];

        db.query(userSql, userValues, (err, userResult) => {
            if (err) {
                console.error("Error inserting into User:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.message.includes('phone_number')) {
                        return res.status(400).json({ error: "Phone number already registered" });
                    } else if (err.message.includes('email')) {
                        return res.status(400).json({ error: "Email already registered" });
                    }
                }
                return res.status(500).json({ error: "Error registering user" });
            }

            const userId = userResult.insertId;
            console.log("Inserted user ID:", userId);

            // Step 2: Insert into Transporter table
            const transporterSql = `
                INSERT INTO Transporter (user_id, contact_person, fleet_size, gst_number)
                VALUES (?, ?, ?, ?)
            `;
            const transporterValues = [userId, ContactPerson, FleetSize, GSTNumber];

            db.query(transporterSql, transporterValues, (err, transporterResult) => {
                if (err) {
                    console.error("Error inserting into Transporter:", err);
                    return res.status(500).json({ error: "Error registering transporter details" });
                }

                res.status(200).json({
                    success: true,
                    message: "Transporter registration successful",
                    redirectUrl: "transporterDashboard.html"
                });
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/registerCompany', async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const {
            CompanyName,
            ContactPerson,
            Phone,
            Email,
            IndustryType,
            WasteTypes,
            Address,
            Password,
            ConfirmPassword
        } = req.body;

        if (!CompanyName || !ContactPerson || !Phone || !Email || !IndustryType || !WasteTypes || !Address || !Password || !ConfirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Insert into User table
        const userSql = `
            INSERT INTO User (name, phone_number, email, password, role, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const userValues = [CompanyName, Phone, Email, hashedPassword, "Company", Address];

        db.query(userSql, userValues, (err, userResult) => {
            if (err) {
                console.error("Error inserting into User:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.message.includes('phone_number')) {
                        return res.status(400).json({ error: "Phone number already registered" });
                    } else if (err.message.includes('email')) {
                        return res.status(400).json({ error: "Email already registered" });
                    }
                }
                return res.status(500).json({ error: "Error registering user" });
            }

            const userId = userResult.insertId;
            console.log("Inserted user ID:", userId);

            // Insert into Company table
            const companySql = `
                INSERT INTO company (user_id, contact_person_name, industry_type, waste_types_accepted)
                VALUES (?, ?, ?, ?)
            `;
            const companyValues = [userId, ContactPerson, IndustryType, WasteTypes];

            db.query(companySql, companyValues, (err, companyResult) => {
                if (err) {
                    console.error("Error inserting into Company:", err);
                    return res.status(500).json({ error: "Error registering company details" });
                }

                res.status(200).json({
                    success: true,
                    message: "Company registration successful",
                    redirectUrl: "companyDashboard.html"
                });
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST route for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM User WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Login query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Redirect based on role
        let redirectUrl;
        switch (user.role) {
            case "FoodProvider":
                redirectUrl = "providerDashboard.html";
                break;
            case "Transporter":
                redirectUrl = "transporterDashboard.html";
                break;
            case "Company":
                redirectUrl = "companyDashboard.html";
                break;
            default:
                redirectUrl = "defaultDashboard.html";
        }

        // res.status(200).json({ success: true, redirectUrl });
        // Don't send password back
        const { password: _, ...safeUser } = user;

        res.status(200).json({ 
            success: true, 
            redirectUrl,
            user: safeUser // send user info to frontend
        });
    });
});

// API endpoint to update user details
app.post('/api/updateUserDetails', (req, res) => {
    const {
        userId,
        businessName,
        contactPerson,
        contactRole,
        contactEmail,
        contactPhone,
        businessAddress,
        businessCity,
        businessState,
        businessPincode,
        businessType,
    } = req.body;

    console.log('Received update request for user:', userId);
    console.log('Update data:', req.body);

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Update the User table
    const updateUserSql = `
        UPDATE User
        SET name = ?, email = ?, phone_number = ?, address = ?
        WHERE user_id = ?
    `;
    
    const fullAddress = [businessAddress, businessCity, businessState, businessPincode].filter(Boolean).join(', ');
    const userValues = [businessName, contactEmail, contactPhone, fullAddress, userId];

    db.query(updateUserSql, userValues, (err, result) => {
        if (err) {
            console.error('Error updating User table:', err);
            return res.status(500).json({ error: 'Failed to update user details' });
        }

        // Get the user role
        const getUserQuery = `SELECT role FROM User WHERE user_id = ?`;
        db.query(getUserQuery, [userId], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching user role:', err);
                return res.status(500).json({ error: 'Failed to fetch user role' });
            }

            const role = results[0].role;
            
            // Update role-specific table
            if (role === 'Company') {
                // Handle empty businessType - use a default value if empty
                const industryType = businessType || 'Other'; // Use 'Other' as default if empty
                
                const updateCompanySql = `
                    UPDATE company
                    SET contact_person_name = ?, industry_type = ?
                    WHERE user_id = ?
                `;
                const companyValues = [contactPerson || '', industryType, userId];

                db.query(updateCompanySql, companyValues, (err) => {
                    if (err) {
                        console.error('Error updating Company table:', err);
                        return res.status(500).json({ error: 'Failed to update company details' });
                    }
                    res.status(200).json({ 
                        success: true, 
                        message: 'Company details updated successfully',
                        updatedUser: {
                            name: businessName,
                            email: contactEmail,
                            phone_number: contactPhone,
                            address: fullAddress,
                            role: 'Company',
                            contactPerson,
                            businessType: industryType
                        }
                    });
                });
            } else if (role === 'FoodProvider') {
                // Handle empty businessType for Provider
                const businessTypeVal = businessType || 'Other';
                
                const updateProviderSql = `
                    UPDATE Provider
                    SET owner_name = ?, business_type = ?
                    WHERE user_id = ?
                `;
                const providerValues = [contactPerson || '', businessTypeVal, userId];

                db.query(updateProviderSql, providerValues, (err) => {
                    if (err) {
                        console.error('Error updating Provider table:', err);
                        return res.status(500).json({ error: 'Failed to update provider details' });
                    }
                    res.status(200).json({ 
                        success: true, 
                        message: 'Provider details updated successfully',
                        updatedUser: {
                            name: businessName,
                            email: contactEmail,
                            phone_number: contactPhone,
                            address: fullAddress,
                            role: 'FoodProvider',
                            contactPerson,
                            businessType: businessTypeVal
                        }
                    });
                });
            } else if (role === 'Transporter') {
                const updateTransporterSql = `
                    UPDATE Transporter
                    SET contact_person = ?
                    WHERE user_id = ?
                `;
                const transporterValues = [contactPerson || '', userId];

                db.query(updateTransporterSql, transporterValues, (err) => {
                    if (err) {
                        console.error('Error updating Transporter table:', err);
                        return res.status(500).json({ error: 'Failed to update transporter details' });
                    }
                    res.status(200).json({ 
                        success: true, 
                        message: 'Transporter details updated successfully',
                        updatedUser: {
                            name: businessName,
                            email: contactEmail,
                            phone_number: contactPhone,
                            address: fullAddress,
                            role: 'Transporter',
                            contactPerson
                        }
                    });
                });
            } else {
                res.status(400).json({ error: 'Invalid user role' });
            }
        });
    });
});

// API endpoint to delete a user
app.delete('/api/deleteUser', (req, res) => {
    const { userId } = req.body;
    
    console.log('Received delete request with body:', req.body);
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    console.log('Delete request for user ID:', userId);
    
    // First, get the user's role to determine which related records to delete
    const getUserQuery = 'SELECT role FROM User WHERE user_id = ?';
    
    db.query(getUserQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user role:', err);
            return res.status(500).json({ error: 'Failed to fetch user details' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const role = results[0].role;
        console.log(`Deleting user with role: ${role}`);
        
        // Begin transaction to ensure atomicity of the deletion process
        db.beginTransaction(err => {
            if (err) {
                console.error('Error beginning transaction:', err);
                return res.status(500).json({ error: 'Failed to begin transaction' });
            }
            
            // Delete records based on user role
            let roleSpecificDeleteQuery;
            
            if (role === 'FoodProvider') {
                roleSpecificDeleteQuery = 'DELETE FROM Provider WHERE user_id = ?';
            } else if (role === 'Company') {
                roleSpecificDeleteQuery = 'DELETE FROM company WHERE user_id = ?';
            } else if (role === 'Transporter') {
                roleSpecificDeleteQuery = 'DELETE FROM Transporter WHERE user_id = ?';
            } else {
                return db.rollback(() => {
                    res.status(400).json({ error: 'Invalid user role' });
                });
            }
            
            // Execute role-specific deletion
            db.query(roleSpecificDeleteQuery, [userId], (err) => {
                if (err) {
                    console.error('Error deleting from role-specific table:', err);
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Failed to delete user details' });
                    });
                }
                
                // Finally, delete from User table
                const deleteUserQuery = 'DELETE FROM User WHERE user_id = ?';
                db.query(deleteUserQuery, [userId], (err) => {
                    if (err) {
                        console.error('Error deleting user:', err);
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Failed to delete user' });
                        });
                    }
                    
                    // Commit transaction if all operations successful
                    db.commit(err => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Failed to commit transaction' });
                            });
                        }
                        
                        console.log('User successfully deleted');
                        res.status(200).json({
                            success: true,
                            message: 'User account successfully deleted'
                        });
                    });
                });
            });
        });
    });
});


//for the OTP genration in FOrgot password
app.post('/send-otp',(req,res)=>{

})

app.post('/api/listing', (req, res) => {
    const { quantity, foodtype, listed_date, best_before, id } = req.body;
    console.log('Received request body:', req.body);

    // Step 1: Get provider_id using user_id
    const providerQuery = 'SELECT provider_id FROM Provider WHERE user_id = ?';

    db.query(providerQuery, [id], (err, providerResults) => {
        if (err) {
            console.error("Error finding provider:", err);
            return res.status(500).json({ message: 'Failed to fetch provider' });
        }

        if (providerResults.length === 0) {
            return res.status(404).json({ message: 'Provider not found for this user' });
        }

        const provider_id = providerResults[0].provider_id;

        const listingQuery = `
            INSERT INTO Listing (quantity, foodtype, listed_date, best_before, provider_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [quantity, foodtype, listed_date, best_before, provider_id];

        db.query(listingQuery, values, (err, result) => {
            if (err) {
                console.error("Error inserting listing:", err);
                return res.status(500).json({ message: 'Failed to add listing' });
            }

            res.status(200).json({ message: 'Listing added successfully' });
        });
    });
});

app.get('/api/getactivelistings', (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id' });
    }

    console.log('Received request to get active listings for user:', user_id);

    const providerQuery = 'SELECT provider_id FROM Provider WHERE user_id = ?';

    db.query(providerQuery, [user_id], (err, providerResults) => {
        if (err) {
            console.error("Error fetching provider_id:", err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (providerResults.length === 0) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        const provider_id = providerResults[0].provider_id;

        const listingsQuery = `
            SELECT listing_id, foodtype, quantity, listed_date, best_before, num_of_interest_companies
            FROM Listing
            WHERE provider_id = ? AND status = 'Active'
            ORDER BY listed_date DESC
        `;

        db.query(listingsQuery, [provider_id], (err, listings) => {
            if (err) {
                console.error("Error fetching listings:", err);
                return res.status(500).json({ message: 'Failed to fetch listings' });
            }

            res.json({ listings });
        });
    });
});
