
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'team';
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  emoji: string;
  department: 'present' | 'future';
  status: string;
  secondary_status: string;
  goal: string;
  github_url?: string;
  revenue: boolean;
  revenue_amount?: string;
  requirements: string;
  inventory: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  custom_fields: CustomField[];
  links: ProjectLink[];
  // NDA flags for regular fields
  goal_is_nda?: boolean;
  requirements_is_nda?: boolean;
  inventory_is_nda?: boolean;
  description_is_nda?: boolean;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
  is_nda: boolean;
}

export interface ProjectLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: User;
}
