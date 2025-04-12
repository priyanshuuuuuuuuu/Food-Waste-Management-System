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
