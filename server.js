const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "radeck",
  database: "usersDB"
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Create user
app.post("/createUser", (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.send("Name and Email required");
  }

  const query = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";

  db.query(query, [name, email, role], (err, result) => {
    if (err) return res.send(err);
    res.send("User created successfully");
  });
});

// Get users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});


// Update users
app.put("/updateUser/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const query = "UPDATE users SET name=?, email=?, role=? WHERE id=?";

  db.query(query, [name, email, role, id], (err, result) => {
    if (err) return res.send(err);

    if (result.affectedRows === 0) {
      return res.send("User not found");
    }

    res.send("User updated successfully");
  });
});

app.delete("/deleteUser/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id=?";

  db.query(query, [id], (err, result) => {
    if (err) return res.send(err);

    if (result.affectedRows === 0) {
      return res.send("User not found");
    }

    res.send("User deleted successfully");
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});