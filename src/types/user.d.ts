export type CreateUserType = {
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

// Define a type for the user object for better type safety
interface User {
  name: string;
  username: string;
  email: string;
  profile_image: string;
  id: number;
  is_blocked?: boolean;
  is_verified?: boolean;
  phone: string;
}

interface EditFields extends Partial<User> {
  is_blocked?: boolean;
  is_verified?: boolean;
}

type NewUserProp = {
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
}

export { CreateUserType, LoginUserType, EditFields, User };
