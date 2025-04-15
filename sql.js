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
        let additionalData = {};

        switch (user.role) {
            case "FoodProvider":
                redirectUrl = "providerDashboard.html";
                break;
            case "Transporter":
                redirectUrl = "transporterDashboard.html";
                break;
            case "Company":
                redirectUrl = "companyDashboard.html";

                // Fetch company_id for the logged-in company
                const companyQuery = `SELECT company_id FROM company WHERE user_id = ?`;
                db.query(companyQuery, [user.user_id], (err, companyResults) => {
                    if (err) {
                        console.error("Error fetching company_id:", err);
                        return res.status(500).json({ error: "Failed to fetch company details" });
                    }

                    if (companyResults.length > 0) {
                        additionalData.company_id = companyResults[0].company_id;
                    }

                    // Send response with company_id
                    const { password: _, ...safeUser } = user;
                    res.status(200).json({
                        success: true,
                        redirectUrl,
                        user: { ...safeUser, ...additionalData }
                    });
                });
                return; // Exit early for async query
            default:
                redirectUrl = "defaultDashboard.html";
        }

        // Send response for non-company roles
        const { password: _, ...safeUser } = user;
        res.status(200).json({
            success: true,
            redirectUrl,
            user: { ...safeUser, ...additionalData }
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

    const providerQuery = 'SELECT provider_id, rating, upcoming_pickups FROM Provider WHERE user_id = ?';

    db.query(providerQuery, [user_id], (err, providerResults) => {
        if (err) {
            console.error("Error fetching provider_id:", err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (providerResults.length === 0) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        const provider_id = providerResults[0].provider_id;
        const rating = providerResults[0].rating;
        const upcoming_pickups = providerResults[0].upcoming_pickups;
        console.log("Provider ID:", provider_id);
        console.log("Rating:", rating);
        console.log("Upcoming pickups:", upcoming_pickups);

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

            res.json({
                listings,
                rating: rating,
                upcoming_pickups: upcoming_pickups
            });
        });
    });
});
app.get('/api/activeprovidercards', (req, res) => {
    const query = `
        SELECT 
            l.listing_id,
            l.quantity,
            l.foodtype,
            l.listed_date,
            p.rating,
            p.provider_id,
            p.owner_name,
            u.name AS provider_name,
            u.address,
            u.phone_number
        FROM Listing l 
        JOIN Provider p ON l.provider_id = p.provider_id
        JOIN User u ON p.user_id = u.user_id
        WHERE l.status = 'Active'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching active provider listings:", err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json({ listings: results });
    });
});

// API endpoint to handle waste requests
app.post('/api/requestWaste', (req, res) => {
    console.log('Received request body:', req.body);
    const { companyId, listingId, user_id } = req.body;

    if (!companyId || !listingId) {
        return res.status(400).json({ message: 'Company ID and Listing ID are required' });
    }

    // Step 1: Fetch listing's foodtype and provider_id
    const listingQuery = `
        SELECT foodtype, provider_id 
        FROM Listing 
        WHERE listing_id = ?
    `;

    db.query(listingQuery, [listingId], (err, listingResults) => {
        if (err || listingResults.length === 0) {
            console.error('Error fetching listing:', err);
            return res.status(500).json({ message: 'Failed to fetch listing details' });
        }

        const { foodtype, provider_id } = listingResults[0];
        console.log("Food Type:", foodtype);
        console.log("Provider ID:", provider_id);
        console.log("Company ID:", companyId);

        // Step 2: Get company name
        db.query('SELECT name FROM User WHERE user_id = ?', [user_id], (err, companyResults) => {
            if (err || companyResults.length === 0) {
                console.error('Error fetching company name:', err);
                return res.status(500).json({ message: 'Failed to fetch company name' });
            }

            const companyName = companyResults[0].name;
            console.log(companyName);
            const message = `${companyName} is interested in your ${foodtype} listing.`;

            // Step 3: Insert into Notification
            const insertNotificationQuery = `
                INSERT INTO Notification (message, sender_id)
                VALUES (?, ?)
            `;

            db.query(insertNotificationQuery, [message, user_id], (err, notificationResult) => {
                if (err) {
                    console.error('Error inserting notification:', err);
                    return res.status(500).json({ message: 'Failed to insert notification' });
                }

                const notificationId = notificationResult.insertId;

                // Step 4: Insert into NotificationReceiver
                const insertReceiverQuery = `
                    INSERT INTO NotificationReceiver (notification_id, receiver_id)
                    VALUES (?, ?)
                `;

                db.query(insertReceiverQuery, [notificationId, provider_id], (err) => {
                    if (err) {
                        console.error('Error inserting notification receiver:', err);
                        return res.status(500).json({ message: 'Failed to insert notification receiver' });
                    }

                    // Step 5: Insert into waste_request
                    const insertWasteRequest = `
                        INSERT INTO waste_request (company_id, listing_id, status)
                        VALUES (?, ?, 'requested')
                    `;

                    db.query(insertWasteRequest, [companyId, listingId], (err) => {
                        if (err) {
                            console.error('Error inserting waste request:', err);
                            return res.status(500).json({ message: 'Failed to submit waste request' });
                        }

                        res.status(200).json({ message: 'Waste request and notification submitted successfully' });
                    });
                });
            });
        });
    });
});


app.get('/api/recent-orders', (req, res) => {
    console.log('Received request for recent orders:', req.query.company_id);
    const companyId = req.query.company_id;

    const sql = `
        SELECT
            wr.request_id AS order_id,
            u.name AS provider_name,
            l.foodtype,
            l.quantity,
            wr.status
        FROM waste_request wr
        JOIN Listing l ON wr.listing_id = l.listing_id
        JOIN Provider p ON l.provider_id = p.provider_id
        JOIN User u ON p.user_id = u.user_id
        WHERE wr.company_id = ?
        ORDER BY wr.request_id DESC;
    `;

    db.query(sql, [companyId], (err, results) => {
        if (err) {
            console.error("Error fetching recent orders:", err);
            return res.status(500).json({ error: "Failed to fetch recent orders" });
        }
        res.json(results);
    });
});

app.post('/api/special-request', (req, res) => {
    const {
      company_id,
      waste_type,
      quantity_required,
      delivery_timeframe,
      special_notes
    } = req.body;
  
    const sql = `
      INSERT INTO Special_Request (
        company_id, waste_type, quantity_required, delivery_timeframe, special_notes
      ) VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(sql, [company_id, waste_type, quantity_required, delivery_timeframe, special_notes], (err, result) => {
      if (err) {
        console.error("Error inserting request:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(201).json({ message: "Request submitted successfully", request_id: result.insertId });
    });
  });

  // 1. Get upcoming pickups for a transporter based on user_id
app.get('/api/upcoming-pickups', (req, res) => {
    console.log('Received request for upcoming pickups:', req.query.user_id);
    const userId = req.query.user_id;
  
    const query = `
      SELECT
        CONCAT('#PK-', p.pickup_id) AS pickup_code,
        u.name AS provider_name,
        CONCAT(DATE_FORMAT(p.pickup_date, '%d %b %Y'), ', ', TIME_FORMAT(p.pickup_time, '%h:%i %p')) AS pickup_time,
        l.foodtype AS waste_type,
        CONCAT(p.total_weight, ' kg') AS quantity,
        p.status
      FROM Pickup p
      JOIN Provider pr ON p.provider_id = pr.provider_id
      JOIN User u ON pr.user_id = u.user_id
      JOIN Listing l ON p.listing_id = l.listing_id
      WHERE p.transporter_id = (
        SELECT transporter_id FROM Transporter WHERE user_id = ?
      )
      ORDER BY p.pickup_date ASC, p.pickup_time ASC
      LIMIT 5;
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching upcoming pickups:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Upcoming pickups:', results);
      res.json(results);
    })
});

app.get('/api/scheduled-pickups/user/:user_id', (req, res) => {
    console.log("INTO IT");
    console.log('Received request for scheduled pickups:', req.params.user_id);

    const userId = req.params.user_id;

    const getTransporterIdQuery = `
        SELECT transporter_id FROM Transporter WHERE user_id = ?
    `;

    db.query(getTransporterIdQuery, [userId], (err, transporterResult) => {
    if (err) {
        console.error('Error fetching transporter_id:', err);
        return res.status(500).json({ error: 'Database error while fetching transporter_id' });
    }

    if (transporterResult.length === 0) {
        return res.status(404).json({ error: 'Transporter not found for given user_id' });
    }

    const transporterId = transporterResult[0].transporter_id;

    const pickupQuery = `
        SELECT
            p.pickup_id AS pickup_id,
            CONCAT('RT-', LPAD(p.pickup_id, 4, '0')) AS route_code,
            u_provider.address AS provider_address,
            u_transporter.address AS transporter_address,
            u_company.address AS company_address,
            TIME_FORMAT(p.pickup_time, '%h:%i %p') AS pickup_time,
            l.quantity AS total_weight,
            p.distance,
            p.status
        FROM Pickup p
        JOIN Provider pr ON p.provider_id = pr.provider_id
        JOIN User u_provider ON pr.user_id = u_provider.user_id
        JOIN Transporter t ON p.transporter_id = t.transporter_id
        JOIN User u_transporter ON t.user_id = u_transporter.user_id
        JOIN Company c ON p.company_id = c.company_id
        JOIN User u_company ON c.user_id = u_company.user_id
        JOIN Listing l ON p.listing_id = l.listing_id
        WHERE p.transporter_id = ? AND p.status IN ('Scheduled', 'In Progress')
        ORDER BY 
            CASE 
                WHEN p.status = 'In Progress' THEN 0
                WHEN p.status = 'Scheduled' THEN 1
                ELSE 2
            END,
            p.pickup_date DESC,
            p.pickup_time DESC

        `;

    db.query(pickupQuery, [transporterId], (err, results) => {
      if (err) {
        console.error('Error fetching pickups:', err);
        return res.status(500).json({ error: 'Database error while fetching pickups' });
      }

      res.json(results);
    });
  });
});

app.post('/api/start-route/:pickupId', (req, res) => {
    const pickupId = req.params.pickupId;
    const newStatus = req.body.newStatus;

    console.log("Starting route for Pickup ID:", pickupId);
    console.log("Updating status to:", newStatus);

    const updateQuery = `
        UPDATE Pickup
        SET status = ?
        WHERE pickup_id = ?
    `;

    db.query(updateQuery, [newStatus, pickupId], (err, result) => {
        if (err) {
            console.error('Error updating route status:', err);
            return res.status(500).json({ error: 'Database error while updating route status' });
        }

        res.json({ message: 'Route status updated successfully!' });
    });
});
