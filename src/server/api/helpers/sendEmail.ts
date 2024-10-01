import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { env } from "process";


const createTransporter = () => {

    const port = Number.parseInt(env.EMAIL_PORT ?? "");

    if(port){
        try{
            const transporter = nodemailer.createTransport({
                host: env.EMAIL_SERVER,
                port: port > 0 ? port : 465,
                secure: true,
                auth: {
                    user: env.EMAIL_USERNAME,
                    pass: env.EMAIL_PASSWORD,
                },
            })
            return transporter;
        }
        catch(e){
            console.error(e);
            return null
        }
    }
    return null
}

interface SendEmailOptions {
    to: string,
    subject: string,
    html: string,
    text?: string,
    replacements?: Record<string, string>,
    template?: string
}

const getHtmlTemplate = (templatePath: string, replacements: Record<string, string>): string => {

    const completePath = path.resolve(process.cwd(), `src/server/api/helpers/emailTemplate/${templatePath}.html`);

    const template = fs.readFileSync(completePath, 'utf8');

    const replacedTemplate =template.replace(/{{(\w+)}}/g, (_, key: string) => replacements[key] ?? '');

    return replacedTemplate

}

export const sendEmail = async ({ to, subject, text, html, template, replacements }: SendEmailOptions) => {


    const htmlTemplate = 
        template != undefined && template != "" ?
            getHtmlTemplate(template, { ...replacements, selfUrl: process.env.SELF_URL ?? "" }) :
            html

    const mailOptions = {
      from: 'Hello Dutchy <info@hellodutchy.com>', 
      to,
      subject,
      text,
      html: htmlTemplate,
    };
  
    try {
        const transporter = createTransporter()
        if(transporter){
            await transporter.sendMail(mailOptions);
            return "Email sent successfully";
        }
        else{
            return "Email not sent: transporter not found"
        }
    } catch (error) {
      return error
    }
  };