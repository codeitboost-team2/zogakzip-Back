import express from 'express';
import upload from '../models/imageModel.js';
import { uploadImage } from '../controllers/imageController.js';

const router = express.Router();

// 이미지 파일 업로드 및 URL 생성
router.post('/upload', upload.single('image'), uploadImage);

export default router;
