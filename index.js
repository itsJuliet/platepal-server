import "dotenv/config";
import express from "express";
import cors from "cors";
import platingsRoutes from './routes/platingsRoutes.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/platings', platingsRoutes); 

app.get('/', (req, res) => {
    res.send('Server is running. Access the API at /api/platings');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});