const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

// Configuración de CORS para permitir el acceso desde el frontend
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Configuración de multer para procesar `multipart/form-data`
const upload = multer();

// Middleware
app.use(bodyParser.json());

// Ruta para enviar correos
app.post('/send-email', upload.any(), async (req, res) => {
    const { mail, nombreRazonSocial} = req.body;
    console.log(req)

    // Configuración de nodemailer (ejemplo con Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'davor@tabacaleraespert.com',         // Tu correo
            pass: 'sjyg zrgr ldmd omtk' // Usa tu App Password de Gmail aquí
        }
    });

    const mailOptions = {
        from: 'davorl@tabacaleraespert.com',
        to: mail,
        subject: nombreRazonSocial,
        
    };

    // Adjuntar archivos si existen
    if (req.files && req.files.length > 0) {
        mailOptions.attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));
    }

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de correo escuchando en http://localhost:${port}`);
});
