import express from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import cors from 'cors'; 
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();


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

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Specific Error Handling for Prisma Errors
app.use((err, req, res, next) => {
  if (err.code && err.code.startsWith('P')) {
    // Prisma-related error
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

//테스트용 데이터베이스 연결 엔드 포인트
app.get('/test-db-connection', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, result });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
