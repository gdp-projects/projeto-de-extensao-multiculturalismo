import express from "express";
const router = express();
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join('.', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const uploads = multer({ storage });

router.get("/", (req, res) => {
    res.json({ mensagem: "Rota de upload funcionando!" });
});

router.post("/", uploads.single("foto"), (req, res) => {
    res.json({
        mensagem: "Foto enviada!",
        caminho: `/uploads/${req.file.filename}`,
        nome: req.file.filename
    });
});

router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    const options = {
        root: "uploads/"
    };
    res.sendFile(filename, options, (err) => {
        if (err) {
            res.status(404).json({ mensagem: "Arquivo não encontrado" });
        } 
    });
});

export default router;