import express from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';


const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/groups', groupRouter);
app.use('/api/images', imageRouter);
app.use('/api/groups/:groupId/posts', postRouter);
app.use('/api/posts/:postId/comments', commentRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});