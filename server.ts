import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Storage } from '@google-cloud/storage';
import { BlobServiceClient } from '@azure/storage-blob';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const uploadMiddleware = (req: any, res: any, next: any) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

// API Routes
app.post('/api/upload/aws', uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { region, accessKeyId, secretAccessKey, bucket } = req.body;
    if (!region?.trim() || !accessKeyId?.trim() || !secretAccessKey?.trim() || !bucket?.trim()) {
      return res.status(400).json({ error: 'Missing or invalid AWS credentials or bucket' });
    }

    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const key = `${Date.now()}-${req.file.originalname}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    res.json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/gcp', uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { projectId, clientEmail, privateKey, bucket } = req.body;
    if (!projectId?.trim() || !clientEmail?.trim() || !privateKey?.trim() || !bucket?.trim()) {
      return res.status(400).json({ error: 'Missing or invalid GCP credentials or bucket' });
    }

    // Fix private key formatting (newlines might be escaped)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const storage = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey,
      },
    });

    const bucketObj = storage.bucket(bucket);
    const key = `${Date.now()}-${req.file.originalname}`;
    const file = bucketObj.file(key);

    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      resumable: false,
    });

    const url = `https://storage.googleapis.com/${bucket}/${key}`;
    res.json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/azure', uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { connectionString, containerName } = req.body;
    if (!connectionString?.trim() || !containerName?.trim()) {
      return res.status(400).json({ error: 'Missing or invalid Azure credentials or container name' });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const key = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(key);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    res.json({ success: true, url: blockBlobClient.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
