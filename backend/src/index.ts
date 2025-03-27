import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins (for development only)
app.use(cors());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World from the backend!');
});

// POST endpoint for vendor signup
app.post('/api/vendors', (req, res) => {
  const vendor = req.body;

  // In a real application, you would validate and save this data to a database.
  // For now, we just simulate vendor creation by echoing back the data.
  res.json({ message: 'Vendor created successfully', vendor });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
