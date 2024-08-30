import express from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import cors from 'cors'; 

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

// CORS
app.use(cors());

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Routes
app.use('/api/groups', groupRouter);
app.use('/api/images', imageRouter);
app.use('/api/groups/:groupId/posts', postRouter);
app.use('/api/posts/:postId/comments', commentRouter);


// 에러 핸들링
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Specific Error Handling
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeDatabaseError') {
    res.status(500).json({ error: 'Database Error' });
  } else {
    next(err);
  }
});

// General Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the stack trace
  res.status(500).json({ error: 'Internal Server Error' }); // Send a general error message
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
