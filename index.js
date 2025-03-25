const express = require("express");
const jwt = require("jsonwebtoken");
const cors=require("cors")
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise"); // Use promise-based MySQL
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const app = express();

const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

app.use(cors());
app.use(express.json());

//Session
app.use(session({
  secret: "your-session-secret", // Secret for signing session IDs
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // In production, you should set this to true with HTTPS
}))


// MySQL database connection (async/await)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "jwt_auth",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  try{

    const token = req.session.token
    if (!token) return res.status(401).send("Access denied. No token provided.");
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user; // Store user in request object
      next();
    });
  }
  catch(err){
    res.status(402).send("Error")
  }
};




// POST /signup - User registration (signup)
app.post("/signup", 
    body("username").notEmpty().withMessage("Username is required"), 
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"), 
    async (req, res) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
  
      const { username, password } = req.body;
  
      try {
        // Check if the username already exists in the database
        const [existingUser] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
          return res.status(400).send("Username already taken");
        }
  
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert new user into the 'users' table
        await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
  
        res.json({ message: "User registered successfully!" });
      } catch (err) {
        res.status(500).send("Database query error");
      }
    }
  );
  




app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0)
      return res.status(400).send("Invalid username or password");

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).send("Invalid username or password");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
      req.session.token=token;

      res.json({message:"Login Successful", token})
    

  } catch (err) {
    res.status(500).send("Database query error");
  }
});

//LOGOUT

app.post("/logout",authenticateJWT, async (req,res)=>{
  try{
    req.session.destroy((err)=>{
      if(err){
        return res.send("Error ")
      }
      res.status(400).json({message:"Logout Successful"})
    })
  }
  catch(error){
    res.status(402).json("Error in logout")
  }
})

// GET /getusers - Protected route
app.get("/getusers", authenticateJWT, async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM user_details WHERE user_id=? ", [
      req.user.id,
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

// POST /adduser - Add a new user (Protected)
app.post(
  "/adduser",
  authenticateJWT, // Added authentication
  body("email").isEmail(),
  body("name").notEmpty(),
  body("age").isNumeric(),
  async (req, res) => {
    try{

      const result = validationResult(req);
      if (!result.isEmpty()) return res.status(400).send("Error in validation");
  
      const { email, name, age } = req.body;
  
      try {
        await db.execute(
          "INSERT INTO user_details (email, name, age, user_id) VALUES (?, ?, ?, ?)",
          [email, name, age, req.user.id]
        );
        res.json({ message: "User added", addedItem: { email, name, age } });
      } catch (err) {
        res.status(500).send("Error inserting user");
      }
    }
    catch(err){
      res.status(402).json("Error in adding user")
    }
  }
);

// PUT /edit/:name - Edit user details (Protected)
app.put(
  "/edit/:id",
  authenticateJWT, // Added authentication
  body("email").isEmail(),
  body("name").notEmpty(),
  body("age").isNumeric(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send("Error in validation");

    const { email, name, age } = req.body;

    try {
      const [results] = await db.execute(
        "UPDATE user_details SET email = ?, name = ?, age = ? WHERE id = ? AND user_id = ?",
        [email, name, age, req.params.name, req.user.id]
      );

      if (results.affectedRows === 0)
        return res.status(404).send("User not found");
      res.json({ message: `${id} updated`, user: { email, name, age } });
    } catch (err) {
      res.status(500).send("Database query error");
    }
  }
);

// DELETE /deleteuser/:name - Delete a user (Protected)
app.delete("/deleteuser/:id", authenticateJWT, async (req, res) => {
  try {
    const [results] = await db.execute(
      "DELETE FROM user_details WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (results.affectedRows === 0)
      return res.status(404).send("User not found");
    res.send(`${req.params.id} deleted`);
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
