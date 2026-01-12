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

// 策略详情指标
export interface StrategyDetailMetrics {
  passRate: number;           // 通过率 %
  errorRate: number;          // 异常率 %
  tp99: number;               // TP99耗时 ms
  todayCalls: number;         // 今日调用量
  callsCompare: number;       // 环比增长 %
  passCount: number;          // 通过数量
  sameTermPassRate: number;   // 同期通过率 %
  errorCount: number;         // 异常数量
}

// 版本状态
export type VersionStatus = 'effective' | 'grayscale' | 'approving' | 'draft' | 'invalid';

// 审批信息
export interface ApprovalInfo {
  approvalId: string;           // OA审批进度ID
  duration: string;             // 审批停留时长
  initiator: string;            // 发起人
  initiatorId: string;          // 发起人ID
  approver: string;             // 审批人
  approverId: string;           // 审批人ID
  initiatedAt: string;          // 发起时间
  currentNode: string;          // 所在节点
}

// 灰度信息
export interface GrayscaleInfo {
  startTime: string;            // 灰度开始时间
  duration: string;             // 灰度运行时长
  trafficRatio: number;         // 灰度流量比例 %
  operator: string;             // 操作人
  metrics: {
    callCount: number;          // 灰度调用量
    passRate: number;           // 灰度通过率
    errorRate: number;          // 灰度异常率
  };
}

// 策略版本
export interface StrategyVersion {
  id: string;
  versionNumber: string;
  description: string;
  status: VersionStatus;
  updatedAt: string;
  updatedBy: string;
  publishedAt?: string;
  onlineTime?: string;          // 在线时长（生效版本）
  approvalInfo?: ApprovalInfo;  // 审批信息（审批中状态）
  grayscaleInfo?: GrayscaleInfo; // 灰度信息（灰度中状态）
}

// 版本发布记录
export interface VersionReleaseRecord {
  id: string;
  versionNumber: string;
  action: 'published' | 'rollback' | 'grayscale';
  timestamp: string;
  operator: string;
}

// 策略变更记录
export interface StrategyChangeRecord {
  id: string;
  type: 'status_change' | 'version_release' | 'config_update';
  description: string;
  timestamp: string;
  operator: string;
}

// 指标趋势数据点
export interface MetricTrendPoint {
  time: string;
  value: number;
  compareValue?: number;
}
