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

export type PublishStatus = 'none' | 'approving' | 'grayscale' | 'published';

export interface StrategyMetrics {
  todayCalls: number;
  errorRate: number; // 百分比，例如 0.5 表示 0.5%
}

export interface Strategy {
  id: string;
  code: string;
  name: string;
  description: string;
  updatedAt: string;
  referenced: boolean; // true: 引用中, false: 未引用
  projectId: string;
  publishStatus: PublishStatus; // 版本发布状态
  metrics: StrategyMetrics; // 调用量和异常率
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
