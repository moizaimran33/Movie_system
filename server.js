const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
mongoose.connect(process.env.MONGO_URL || "mongodb://mongodb:27017/moviedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"));


// Schema
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
  role: String,
}));

const Movie = mongoose.model("Movie", new mongoose.Schema({
  title: String,
  director: String,
  tickets: Number,
}));
// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).send({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash, role: "public" });
  res.send({ message: "Account created successfully!" });
});
// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.send({ role: user.role });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// Add test users (GET once)
app.get("/setup-users", async (req, res) => {
  const hash = await bcrypt.hash("123456", 10);
  await User.deleteMany({});

  await User.insertMany([
    { email: "manager@cinema.com", password: hash, role: "manager" },
    { email: "staff@cinema.com", password: hash, role: "staff" },
    { email: "public@cinema.com", password: hash, role: "public" }
  ]);

  res.send("✅ All roles created. Use 123456 as password.");
});
// Add Movie
app.post('/movies', async (req, res) => {
  const { title, director, tickets } = req.body;
  if (!title || !director || isNaN(tickets)) {
    return res.status(400).send({ message: 'Invalid input' });
  }
  await Movie.create({ title, director, tickets });
  res.send({ message: 'Movie added successfully' });
});

// Get All Movies
app.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

// Edit Movie
app.put('/movies/:id', async (req, res) => {
  const { title, director, tickets } = req.body;
  await Movie.findByIdAndUpdate(req.params.id, { title, director, tickets });
  res.send({ message: 'Movie updated successfully' });
});

// Delete Movie
app.delete('/movies/:id', async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.send({ message: 'Movie deleted successfully' });
});
// Backend code to handle booking a ticket (assuming MongoDB and Mongoose)

    


app.post('/movies/:id/book', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    // Find movie
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (movie.tickets <= 0) {
      return res.status(400).json({ message: "No tickets available" });
    }

    // Decrease tickets
    movie.tickets -= 1;
    await movie.save();

    res.json({ message: "Ticket booked successfully" });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error during booking" });
  }
});






app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
