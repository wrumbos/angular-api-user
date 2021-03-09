export interface User {
  status: string;
  data: {
    id: number;
    email: string;
    full_name: string;
    address: string;
    phone: string;
    created: string;
    token: string;
    expiresIn: number;
  };
}
