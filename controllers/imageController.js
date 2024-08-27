import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadImage = async (req, res) => {
    if (req.file) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // 데이터베이스에 이미지 정보 저장
        try {
            const savedImage = await prisma.image.create({
                data: {
                    filename: req.file.filename,
                    url: imageUrl,
                },
            });

            res.status(200).json({ imageUrl: savedImage.url });
        } catch (error) {
            console.error('Error saving image to DB:', error);
            res.status(500).send('Error saving image to database.');
        }
    } else {
        res.status(400).send('No file uploaded.');
    }
};