import nodemailer from 'nodemailer';

interface MailResponse {
  response: string;
  [key: string]: any;
}

const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<MailResponse> => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    let info = await transporter.sendMail({
      from: `"RESQ360" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    });
    console.log(info.response);
    return info;
  } catch (error: any) {
    console.log(error.message);
    return { response: error.message };
  }
};

export default mailSender; 