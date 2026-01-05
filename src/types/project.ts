export type UserRole = 'admin' | 'editor' | 'viewer' | 'pending';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  userRole: UserRole;
  strategyCount: number;
  // 申请相关信息（仅申请中状态使用）
  applicationInfo?: {
    appliedAt: string;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  // 权限升级申请信息（仅查看者角色使用）
  upgradeApplication?: {
    targetRole: 'editor' | 'admin';
    appliedAt: string;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
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
