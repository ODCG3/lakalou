import { Request } from 'express';
// utils/Validator.d.ts
export function validateName(name: string): boolean;
export function validateImageExtension(image: string): boolean;

// Extend the Request interface to include your custom attributes
declare global {
  namespace Express {
    interface Request {
      user?: {userID:number};  // Custom attribute example
      isAuthenticated?: boolean;  // Another custom attribute example
    }
  }
}