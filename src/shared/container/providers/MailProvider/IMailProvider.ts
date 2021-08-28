interface IMailProvider {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

export { IMailProvider };
