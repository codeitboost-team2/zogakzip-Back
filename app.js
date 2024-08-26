import express from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRoutes.js';

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/groups', groupRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});