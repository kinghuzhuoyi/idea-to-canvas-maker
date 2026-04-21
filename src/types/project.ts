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
  tp95?: number;              // TP95耗时 ms
  tp50?: number;              // TP50耗时 ms
  todayCalls: number;         // 今日调用量
  callsCompare: number;       // 环比增长 %（对比昨日同时间段）
  passCount: number;          // 通过数量
  sameTermPassRate: number;   // 同期通过率 %
  passRateCompare?: number;   // 通过率环比（对比昨日全天）
  errorRateCompare?: number;  // 异常率环比
  errorCount: number;         // 异常数量
}

// 拒绝原因分布
export interface RejectReasonItem {
  code: string;         // reject_code 标签
  label: string;        // 中文描述
  count: number;        // 命中数量
  percentage: number;   // 占比 %
}

// 授信额度/定价分布
export interface DistributionBucket {
  range: string;        // 区间描述，例如 "1-3万"
  count: number;        // 订单数
  percentage: number;   // 占比 %
}

// 节点通过率
export interface NodeVerdictItem {
  nodeId: string;
  nodeName: string;
  total: number;        // 节点流入量
  passCount: number;    // 通过数
  passRate: number;     // 通过率 %
}

// 规则命中排行
export interface RuleHitItem {
  ruleId: string;
  ruleCode: string;
  ruleName: string;
  hitCount: number;     // 命中数量
  rank: number;         // 排名
  trend: number;        // 环比 %
}

// 监控筛选条件
export interface MonitoringFilter {
  businessCode: string;       // 业务场景
  dateRange: 'today' | '7d' | '30d' | 'custom';
  customerTag: string;        // 客户标签 / AB分流种子
}

// 版本状态
export type VersionStatus = 'effective' | 'grayscale' | 'approving' | 'draft' | 'invalid';

// 灰度阶段
export type GrayscaleStage = 'observing' | 'scaling' | 'stable';

// 审批节点
export interface ApprovalNode {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'current' | 'rejected';
  approver?: string;
  approvedAt?: string;
}

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
  nodes?: ApprovalNode[];       // 审批节点列表
  isOverdue?: boolean;          // 是否超时
  estimatedCompleteTime?: string; // 预计完成时间
  remindCount?: number;         // 催办次数
}

// 自动扩量规则
export interface AutoScaleRule {
  id: string;
  type: 'time' | 'metric';
  trigger: string;              // 触发条件描述
  targetRatio: number;          // 目标流量比例
  enabled: boolean;
}

// 灰度成功标准
export interface GrayscaleSuccessCriteria {
  minPassRate: number;          // 最低通过率
  maxErrorRate: number;         // 最高异常率
  minDuration: string;          // 最短运行时长
}

// 灰度信息
export interface GrayscaleInfo {
  startTime: string;            // 灰度开始时间
  duration: string;             // 灰度运行时长
  trafficRatio: number;         // 灰度流量比例 %
  operator: string;             // 操作人
  stage?: GrayscaleStage;       // 灰度阶段
  autoScaleRules?: AutoScaleRule[];  // 自动扩量规则
  successCriteria?: GrayscaleSuccessCriteria; // 成功标准
  isPaused?: boolean;           // 是否暂停
  metrics: {
    callCount: number;          // 灰度调用量
    passRate: number;           // 灰度通过率
    errorRate: number;          // 灰度异常率
  };
  compareMetrics?: {            // 与生效版本对比
    callCount: number;
    passRate: number;
    errorRate: number;
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
  createdAt?: string;           // 创建时间
  createdBy?: string;           // 创建人
  publishedAt?: string;
  onlineTime?: string;          // 在线时长（生效版本）
  approvalInfo?: ApprovalInfo;  // 审批信息（审批中状态）
  grayscaleInfo?: GrayscaleInfo; // 灰度信息（灰度中状态）
  tags?: string[];              // 版本标签
  healthStatus?: 'healthy' | 'warning' | 'error'; // 健康状态
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

// 版本对比结果
export interface VersionCompareResult {
  version1: string;
  version2: string;
  differences: {
    field: string;
    label: string;
    value1: string;
    value2: string;
    type: 'added' | 'removed' | 'modified';
  }[];
}
