export enum UserRole {
  CLIENT = 'client',
  ARTISAN = 'artisan',
}

export enum EmploymentStatus {
  STUDENT = 'student',
  EMPLOYED = 'employed',
  SELF_EMPLOYED = 'self_employed',
  FREELANCER = 'freelancer',
  UNEMPLOYED = 'unemployed',
  RETIRED = 'retired',
}

export class User {
  user_id: string;
  username?: string;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  wilaya: string;
  birthday?: Date;
  bio?: string;
  profile_picture?: string;
  employment_status?: EmploymentStatus;
  email_verified: boolean;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
