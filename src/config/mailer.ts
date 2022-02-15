const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '${proess.env.EMAIL_ADRESS}',
        pass: '${process.env.EMAIL_PASSWORD}',
    }
});

const emailPort = process.env.EMAIL_PORT || 3000;

const mailOptions = {
    from: 'bot.admin@gmail.com',
    to: '${admin.email}',
    subject: 'Libros prestados',
    text: '${emailPort}/Estos son los libros prestados/${admin.id}/${token}'
};

mailTransporter.sendMail(mailOptions, (err: any, response: any) => {
    if (err) {
        console.error('Ha ocurrido un error:', err);
    } else {
        console.log('Respuesta:', response);
        response.status(200).json('El email ha sido enviado')

    }
});