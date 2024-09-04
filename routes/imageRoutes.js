import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imageController.js';


const router = express.Router();

// Multer 설정 (메모리 저장소 사용)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 이미지 업로드 라우트
router.post('/upload', upload.single('image'), uploadImage);

export default router;
