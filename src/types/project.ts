export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  userRole: UserRole;
  strategyCount: number;
}

export interface Strategy {
  id: string;
  code: string;
  name: string;
  description: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'draft';
  projectId: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  avatar?: string;
}

export interface ProjectStats {
  totalMembers: number;
  adminCount: number;
  editorCount: number;
  viewerCount: number;
}
