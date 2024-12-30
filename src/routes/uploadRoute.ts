import express from "express";
import { uploadPdf } from "../controllers/uploadController";
import { authMiddlewareJWT } from "../middlewares/authmiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

router.post("/upload", authMiddlewareJWT, upload.single("file"), uploadPdf);

export default router;
