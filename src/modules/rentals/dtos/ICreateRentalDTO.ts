interface ICreateRentalDTO {
  id?: string;
  user_id: string;
  car_id: string;
  end_date?: Date;
  expected_return_date: Date;
  total?: number;
}

export { ICreateRentalDTO };
