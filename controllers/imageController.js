import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createImage } from '../models/imageModel.js';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const filename = Date.now() + '-' + file.originalname;
    const uploadDir = path.join(__dirname, '../uploads');
    const uploadPath = path.join(uploadDir, filename);

    // uploads 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // 파일을 서버의 지정된 경로에 저장
    fs.writeFileSync(uploadPath, file.buffer);

    // 이미지 정보를 데이터베이스에 저장
    const image = await createImage(filename, `/uploads/${filename}`);

    // 클라이언트에 이미지 URL 응답
    res.status(200).json({ imageUrl: image.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};