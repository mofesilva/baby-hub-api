import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../../middlewares/require-admin.js';
import { uploadBuffer } from '../../services/storage.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Formato de arquivo não suportado'));
        }
        return cb(null, true);
    },
});

router.post('/', requireAdmin, upload.single('file'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ errors: [{ msg: 'Arquivo não enviado', param: 'file', location: 'body' }] });
    }

    const folder = req.body.folder || 'uploads';

    try {
        const result = await uploadBuffer({
            buffer: req.file.buffer,
            filename: req.file.originalname,
            folder,
            contentType: req.file.mimetype,
        });

        return res.status(201).json({
            data: {
                key: result.key,
                url: result.url,
                size: result.size,
                contentType: result.contentType,
                originalName: req.file.originalname,
            },
        });
    } catch (error) {
        if (error.message.includes('Storage')) {
            return res.status(500).json({ errors: [{ msg: error.message }] });
        }
        return next(error);
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Formato de arquivo não suportado') {
        return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    return next(err);
});

export default router;
