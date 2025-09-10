import express from 'express';
import dotenv from 'dotenv';
import { DatabaseConnection } from './config/database';
import { CatService } from './services/CatService';
import { createCatRoutes } from './routes/catRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const catApiKey = process.env.CAT_API_KEY || '';
const catApiBaseUrl = process.env.CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/catapi';

const catService = new CatService(catApiKey, catApiBaseUrl);


app.use('/api/cats', createCatRoutes(catService));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const startServer = async () => {
  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect(mongoUri);
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;