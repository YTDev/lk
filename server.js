const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const printifyResponse = await uploadToPrintify(req.file.filename, uploadedImageUrl);
        res.send({ 
            message: 'Image uploaded successfully',
            // printifyResponse: printifyResponse.data 
        });
    } catch (error) {
        console.error('Error uploading to Printify:', error);
        res.status(500).send('Error uploading to Printify');
    }
});

async function uploadToPrintify(fileName, imageUrl) {
    const requestBody = {
        file_name: fileName,
        url: imageUrl
    };

    console.log('Request Body:', requestBody);
    
    // const config = {
    //     headers: {
    //         'Authorization': 'Bearer YOUR_PRINTIFY_API_KEY'
    //     }
    // };

    // return axios.post('https://api.printify.com/v1/uploads/images.json', requestBody, config);
    return null;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
