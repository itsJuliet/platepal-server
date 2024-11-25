import "dotenv/config";
import express from "express";
import cors from "cors";
import platingsRoutes from './routes/platingsRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running. Access the API at /api/platings');
});

app.use('/api/platings', platingsRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});