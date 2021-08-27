interface ICreateUserTokenDTO {
  refresh_token: string;
  user_id: string;
  expires_date: Date;
}

export { ICreateUserTokenDTO };
