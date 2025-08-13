type CreateUserType = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country: string;
};

type LoginUserType = {
  email: string;
  password: string;
};

export { CreateUserType, LoginUserType };
