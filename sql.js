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
    password: 'Priyanshu123@',
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
