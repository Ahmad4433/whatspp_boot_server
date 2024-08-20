
const express = require('express');
const cors = require('cors');
const venom = require('venom-bot');
const generateRandomMobileNumber = require('./generateNum')

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let venomClient = null;
let clientReady = false;

// Initialize Venom Client
const initializeVenom = async () => {
    try {
        console.log('Initializing Venom client...');
        venomClient = await venom.create({
            session: 'my-session', // Custom session name
            headless: true, // Set to false if you want to see the browser
            useChrome: true, // Ensure Chrome is used
            logQR: true, // Logs the QR code in the terminal
            disableSpins: true, // Disable spinner logs
            browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // Fix for certain environments
        });
        clientReady = true;
        console.log('Venom client initialized successfully.');
    } catch (error) {
        console.error('Error initializing Venom client:', error);
        process.exit(1); // Exit process if initialization fails
    }
};

// Call the initialization function
initializeVenom();

// Middleware to check if Venom client is ready
const checkVenomClient = (req, res, next) => {
    if (!clientReady) {
        return res.status(503).json({ message: 'Venom client is initializing. Please try again shortly.' });
    }
    next();
};






// Route to check WhatsApp number registration status
// app.post('/', checkVenomClient, async (req, res) => {
//     const numbers = generateRandomMobileNumber()

//     if (!Array.isArray(numbers) || numbers.length === 0) {
//         return res.status(400).json({ message: 'Please provide an array of numbers to check.' });
//     }

//     try {
//         const results = await Promise.all(
//             numbers.map(async (number) => {
//                 const formattedNumber = `${number}@c.us`; // Adjust according to your country code
//                 try {
//                     const result = await venomClient.checkNumberStatus(formattedNumber);
//                     if (result && result.numberExists) {
//                         console.log(`The number ${number} is registered on WhatsApp.`);
//                         return { number, status: 'registered' };
//                     } else {
//                         console.log(`The number ${number} is NOT registered on WhatsApp.`);
//                         return { number, status: 'not registered' };
//                     }
//                 } catch (error) {
//                     console.error(`Error checking number ${number}:`, error.message);
//                     return { number, status: 'error', error: error.message };
//                 }
//             })
//         );

//         res.status(200).json({ message: 'success', results });
//     } catch (error) {
//         console.error('Error processing request:', error.message);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

app.post('/', checkVenomClient, async (req, res) => {
    const numbers = generateRandomMobileNumber();

    if (!Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of numbers to check.' });
    }

    const results = [];

    try {
        for (const number of numbers) {
            const formattedNumber = `${number}@c.us`; // Adjust according to your country code
            try {
                const result = await venomClient.checkNumberStatus(formattedNumber);
                if (result && result.numberExists) {
                    console.log(`The number ${number} is registered on WhatsApp.`);
                    results.push({ number, status: 'registered' });
                } else {
                    console.log(`The number ${number} is NOT registered on WhatsApp.`);
                    results.push({ number, status: 'not registered' });
                }
            } catch (error) {
                console.error(`Error checking number ${number}:`, error.message);
                results.push({ number, status: 'error', error: error.message });
            }

            // Introduce a delay before checking the next number
            await new Promise((resolve) => setTimeout(resolve, 500)); // 1000ms delay between each check
        }


     


        res.status(200).json({ message: 'success', results,status:true });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});




// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy', clientReady });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    if (venomClient) {
        await venomClient.close();
        console.log('Venom client closed.');
    }
    process.exit(0);
});



