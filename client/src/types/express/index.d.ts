import { JWTPayload } from "jose";

declare global {
  namespace Express {
    interface User extends JWTPayload {
      id: number;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}
