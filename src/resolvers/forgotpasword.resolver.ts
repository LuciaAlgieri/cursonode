import { resourceLimits } from "worker_threads";
const { User } = require('../entity/user.entity');
const nodemailer = require("nodemailer");
import { Jwt } from "jsonwebtoken";
import { Response, Request } from "express";
require('dotenv').config();
import { sign } from "jsonwebtoken";

const ForgotPasword = {
    async sendMail(req, res) {
        if (req.body.email == "") {
            res.status(400).send({
                message: 'El email es requerido'
            })
        }

        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (!user)
                return req.status(403).send({
                    message: 'No existe ese mail'
                })

        };

        const token = jwt.sign({ id: User.Id }, ' ', { expiresIn: "1h" });
        User.update({
            tokenResetPasswpord: token
        });
        const transporter = nodemailer.createTransport({
            service: 'gmail,',
            auth: {
                user: '${proess.env.EMAIL_ADRESS}',
                pass: '${process.env.EMAIL_PASSWORD}',
            },
        });

        const emailPort = process.env.EMAIL_PORT || 3000;

        const mailOptions = {
            from: 'bot.admin@gmail.com',
            to: '${user.email}',
            subject: 'Enlace para recuperar su cuenta',
            text: '${emailPort}/resetpassword/${user.id}/${token}'
        };

        mailTransporter.sendMail(mailOptions, (err: any, response: any) => {
            if (err) {
                console.error('Ha ocurrido un error:', err);
            } else {
                console.log('Respuesta:', response);
                res.status(200).json('El email para la recuperación ha sido enviado');

            }
        })

    }
}



module.exports = ForgotPasword;