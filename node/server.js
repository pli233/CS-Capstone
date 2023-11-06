const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/cats', require('./routes/api/cats'));
app.use('/api/download', require('./routes/api/download'));
app.use('/api/notes', require('./routes/api/notes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port ${PORT}'));
