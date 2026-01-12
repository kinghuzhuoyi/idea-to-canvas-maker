import { 
  StrategyDetailMetrics, 
  StrategyVersion, 
  VersionReleaseRecord, 
  StrategyChangeRecord,
  MetricTrendPoint 
} from '@/types/project';

// 策略详情指标
export const mockStrategyDetailMetrics: Record<string, StrategyDetailMetrics> = {
  's1': {
    passRate: 98.5,
    errorRate: 0.12,
    tp99: 45,
    todayCalls: 12580,
    callsCompare: 12.5,
    passCount: 12391,
    sameTermPassRate: 97.2,
    errorCount: 15,
  },
  's2': {
    passRate: 96.8,
    errorRate: 0.25,
    tp99: 62,
    todayCalls: 8320,
    callsCompare: -5.2,
    passCount: 8054,
    sameTermPassRate: 95.5,
    errorCount: 21,
  },
};

// 策略版本列表
export const mockStrategyVersions: Record<string, StrategyVersion[]> = {
  's1': [
    { 
      id: 'v1', 
      versionNumber: 'v2.1.0', 
      description: '优化信用评分算法，提升准确率', 
      status: 'effective', 
      updatedAt: '2024-12-15 14:30', 
      updatedBy: '张三', 
      publishedAt: '2024-12-15 15:00',
      onlineTime: '20天10小时10分钟',
    },
    { 
      id: 'v2', 
      versionNumber: 'v2.0.0', 
      description: '新增多维度特征支持，增强风险识别能力', 
      status: 'approving', 
      updatedAt: '2024-12-21 13:35', 
      updatedBy: '李四',
      approvalInfo: {
        approvalId: '38271881823',
        duration: '2天5小时30分钟',
        initiator: '李四',
        initiatorId: '21010238',
        approver: '张三',
        approverId: '21010456',
        initiatedAt: '2024-12-19 08:05',
        currentNode: '领导审批',
      },
    },
    { id: 'v3', versionNumber: 'v1.5.0', description: '修复边界条件问题', status: 'draft', updatedAt: '2024-12-05 09:15', updatedBy: '王五' },
    { id: 'v4', versionNumber: 'v1.0.0', description: '初始版本发布', status: 'invalid', updatedAt: '2024-11-20 16:00', updatedBy: '张三', publishedAt: '2024-11-21 10:00' },
  ],
  's2': [
    { 
      id: 'v5', 
      versionNumber: 'v1.2.0', 
      description: '增加实时风险评估，优化检测准确率', 
      status: 'grayscale', 
      updatedAt: '2024-12-14 11:00', 
      updatedBy: '李四',
      grayscaleInfo: {
        startTime: '2024-12-14 12:00',
        duration: '2天3小时',
        trafficRatio: 20,
        operator: '李四',
        metrics: {
          callCount: 1580,
          passRate: 97.2,
          errorRate: 0.15,
        },
      },
    },
    { 
      id: 'v6', 
      versionNumber: 'v1.1.0', 
      description: '优化欺诈检测规则', 
      status: 'effective', 
      updatedAt: '2024-12-08 14:30', 
      updatedBy: '张三', 
      publishedAt: '2024-12-08 16:00',
      onlineTime: '8天6小时20分钟',
    },
    { id: 'v7', versionNumber: 'v1.0.0', description: '初始版本', status: 'draft', updatedAt: '2024-11-25 10:00', updatedBy: '王五' },
  ],
};

// 版本发布记录
export const mockVersionReleaseRecords: Record<string, VersionReleaseRecord[]> = {
  's1': [
    { id: 'r1', versionNumber: 'v2.1.0', action: 'published', timestamp: '2024-12-15 15:00', operator: '张三' },
    { id: 'r2', versionNumber: 'v2.0.0', action: 'grayscale', timestamp: '2024-12-12 10:00', operator: '李四' },
    { id: 'r3', versionNumber: 'v1.5.0', action: 'rollback', timestamp: '2024-12-06 09:00', operator: '王五' },
    { id: 'r4', versionNumber: 'v1.0.0', action: 'published', timestamp: '2024-11-21 10:00', operator: '张三' },
  ],
  's2': [
    { id: 'r5', versionNumber: 'v1.2.0', action: 'grayscale', timestamp: '2024-12-14 12:00', operator: '李四' },
    { id: 'r6', versionNumber: 'v1.1.0', action: 'published', timestamp: '2024-12-08 16:00', operator: '张三' },
  ],
};

// 策略变更记录
export const mockStrategyChangeRecords: Record<string, StrategyChangeRecord[]> = {
  's1': [
    { id: 'c1', type: 'version_release', description: 'v2.1.0 版本发布上线', timestamp: '2024-12-15 15:00', operator: '张三' },
    { id: 'c2', type: 'config_update', description: '更新权重配置参数', timestamp: '2024-12-14 11:30', operator: '李四' },
    { id: 'c3', type: 'status_change', description: '策略状态变更为"已发布"', timestamp: '2024-12-15 15:00', operator: '系统' },
    { id: 'c4', type: 'version_release', description: 'v2.0.0 开始灰度测试', timestamp: '2024-12-12 10:00', operator: '李四' },
    { id: 'c5', type: 'config_update', description: '调整评分阈值', timestamp: '2024-12-10 14:20', operator: '王五' },
  ],
  's2': [
    { id: 'c6', type: 'version_release', description: 'v1.2.0 开始灰度测试', timestamp: '2024-12-14 12:00', operator: '李四' },
    { id: 'c7', type: 'status_change', description: '策略进入灰度阶段', timestamp: '2024-12-14 12:00', operator: '系统' },
    { id: 'c8', type: 'config_update', description: '新增设备指纹检测规则', timestamp: '2024-12-13 09:00', operator: '张三' },
  ],
};

// 生成趋势数据的辅助函数
function generateTrendData(baseValue: number, days: number, variance: number = 0.2): MetricTrendPoint[] {
  const data: MetricTrendPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    data.push({
      time: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: Math.round(baseValue * randomFactor),
      compareValue: Math.round(baseValue * randomFactor * 0.9),
    });
  }
  return data;
}

// 指标趋势数据
export const mockMetricsTrend: Record<string, {
  calls: MetricTrendPoint[];
  passRate: MetricTrendPoint[];
  errorRate: MetricTrendPoint[];
  tp99: MetricTrendPoint[];
}> = {
  's1': {
    calls: generateTrendData(12000, 7, 0.3),
    passRate: [
      { time: '12月9日', value: 97.5, compareValue: 96.8 },
      { time: '12月10日', value: 98.1, compareValue: 97.0 },
      { time: '12月11日', value: 97.8, compareValue: 96.5 },
      { time: '12月12日', value: 98.3, compareValue: 97.2 },
      { time: '12月13日', value: 98.0, compareValue: 96.9 },
      { time: '12月14日', value: 98.4, compareValue: 97.1 },
      { time: '12月15日', value: 98.5, compareValue: 97.2 },
    ],
    errorRate: [
      { time: '12月9日', value: 0.15 },
      { time: '12月10日', value: 0.12 },
      { time: '12月11日', value: 0.18 },
      { time: '12月12日', value: 0.14 },
      { time: '12月13日', value: 0.11 },
      { time: '12月14日', value: 0.10 },
      { time: '12月15日', value: 0.12 },
    ],
    tp99: [
      { time: '12月9日', value: 48 },
      { time: '12月10日', value: 45 },
      { time: '12月11日', value: 52 },
      { time: '12月12日', value: 46 },
      { time: '12月13日', value: 44 },
      { time: '12月14日', value: 43 },
      { time: '12月15日', value: 45 },
    ],
  },
  's2': {
    calls: generateTrendData(8000, 7, 0.25),
    passRate: [
      { time: '12月9日', value: 95.8, compareValue: 94.5 },
      { time: '12月10日', value: 96.2, compareValue: 95.0 },
      { time: '12月11日', value: 96.5, compareValue: 95.2 },
      { time: '12月12日', value: 96.1, compareValue: 94.8 },
      { time: '12月13日', value: 96.6, compareValue: 95.3 },
      { time: '12月14日', value: 96.8, compareValue: 95.5 },
      { time: '12月15日', value: 96.8, compareValue: 95.5 },
    ],
    errorRate: [
      { time: '12月9日', value: 0.28 },
      { time: '12月10日', value: 0.25 },
      { time: '12月11日', value: 0.30 },
      { time: '12月12日', value: 0.26 },
      { time: '12月13日', value: 0.24 },
      { time: '12月14日', value: 0.23 },
      { time: '12月15日', value: 0.25 },
    ],
    tp99: [
      { time: '12月9日', value: 65 },
      { time: '12月10日', value: 62 },
      { time: '12月11日', value: 68 },
      { time: '12月12日', value: 64 },
      { time: '12月13日', value: 60 },
      { time: '12月14日', value: 58 },
      { time: '12月15日', value: 62 },
    ],
  },
};

// 获取默认的策略指标
export function getDefaultMetrics(): StrategyDetailMetrics {
  return {
    passRate: 95.0,
    errorRate: 0.5,
    tp99: 50,
    todayCalls: 5000,
    callsCompare: 0,
    passCount: 4750,
    sameTermPassRate: 94.0,
    errorCount: 25,
  };
}

// 获取默认的趋势数据
export function getDefaultTrendData() {
  return {
    calls: generateTrendData(5000, 7, 0.2),
    passRate: generateTrendData(95, 7, 0.02).map(p => ({ ...p, value: Math.min(100, p.value) })),
    errorRate: generateTrendData(0.5, 7, 0.3).map(p => ({ ...p, value: Math.max(0, p.value) })),
    tp99: generateTrendData(50, 7, 0.2),
  };
}
