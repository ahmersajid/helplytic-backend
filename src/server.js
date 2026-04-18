import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

const PORT = process.env.PORT || 5000;

connectDB();

// Only run app.listen locally to avoid Port binding crashes inside Vercel's serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

export default app;
