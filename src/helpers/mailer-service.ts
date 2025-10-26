import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "97c076001@smtp-brevo.com",
      pass: "gf2n3vNM1dzZWImT",
    },
  });

  async sendOtp(email: string, otp: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Taproost" <no-reply@yourapp.com>',
        to: email,
        subject: "Verify your email address",
        text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your OTP code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
      });

      this.logger.log(`OTP sent to ${email}, messageId: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error.stack);
      throw error;
    }
  }
}
