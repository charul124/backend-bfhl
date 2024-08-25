const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const mongoURI = "mongodb+srv://hbjarko:fPen4qtY8PLGkWGd@igalaxy.r24bfks.mongodb.net/Reg?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

// Define a schema and model for MongoDB
const SampleSchema = new mongoose.Schema({
    data: [String],
    created_at: { type: Date, default: Date.now }
});

const SampleModel = mongoose.model('Sample', SampleSchema);

// GET method for the /bfhl route
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// POST method for the /bfhl route
app.post('/bfhl', async (req, res) => {
    const data = req.body.data || [];
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
    const highestLowercase = alphabets.filter(char => char === char.toLowerCase())
                                      .sort().pop() || '';

    const response = {
        is_success: true,
        user_id: "Charul_Srinivas_29042003",
        email: "charulaletiwar0429@gmail.com",
        roll_number: "21BCE11077",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : []
    };

    // Save to MongoDB (optional)
    try {
        const newEntry = new SampleModel({ data });
        await newEntry.save();
        console.log('Data saved to MongoDB:', newEntry);
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
    }

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
