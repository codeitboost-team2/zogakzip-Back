import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url'; // 추가: fileURLToPath import

// __dirname 대체
const __filename = fileURLToPath(import.meta.url); // 추가: __filename 설정
const __dirname = path.dirname(__filename); // 추가: __dirname 설정

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

// 정적 파일 서빙 (이미지 URL을 제공하기 위함)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/groups', groupRouter);
app.use('/api/images', imageRouter);
app.use('/api/groups/:groupId/posts', postRouter);
app.use('/api/posts/:postId/comments', commentRouter);

// 테스트용 데이터베이스 연결 엔드 포인트
app.get('/test-db-connection', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    const processedResult = result.map(row => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) =>
          typeof value === 'bigint' ? [key, value.toString()] : [key, value]
        )
      );
    });
    res.json({ success: true, result: processedResult });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
