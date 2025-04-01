const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./middleware/session");
const errorHandler = require("./middleware/errorHandler"); // Import error handler
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware()); // Apply session middleware

// Use Routes
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use(errorHandler); // Handle all errors passed to next()


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
