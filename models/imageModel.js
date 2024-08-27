import multer from 'multer';
import path from 'path';

// 파일 저장을 위한 multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // 파일 이름 설정
    }
});

const upload = multer({ storage: storage });

export default upload;