import {
  RejectReasonItem,
  DistributionBucket,
  NodeVerdictItem,
  RuleHitItem,
  MetricTrendPoint,
  MonitoringGranularity,
  OutputField,
} from '@/types/project';

// 输出字段池（用于自定义指标挑选）
export const mockOutputFields: OutputField[] = [
  { code: 'credit_score', label: '信用分', type: 'number', sample: '680' },
  { code: 'credit_limit', label: '授信额度', type: 'number', sample: '50000' },
  { code: 'apr', label: '年化利率', type: 'number', sample: '18.5' },
  { code: 'age', label: '客户年龄', type: 'number', sample: '32' },
  { code: 'monthly_income', label: '月收入', type: 'number', sample: '8500' },
  { code: 'debt_ratio', label: '负债率', type: 'number', sample: '0.45' },
  { code: 'multi_loan_count', label: '多头借贷数', type: 'number', sample: '3' },
  { code: 'risk_level', label: '风险等级', type: 'string', sample: 'M2' },
  { code: 'customer_segment', label: '客群分层', type: 'string', sample: 'A1' },
  { code: 'channel_code', label: '渠道编码', type: 'string', sample: 'CH_001' },
  { code: 'device_os', label: '设备系统', type: 'string', sample: 'iOS' },
  { code: 'is_new_user', label: '是否新客', type: 'boolean', sample: 'true' },
  { code: 'is_vip', label: '是否VIP', type: 'boolean', sample: 'false' },
  { code: 'has_overdue', label: '是否有逾期', type: 'boolean', sample: 'false' },
  { code: 'occupation_type', label: '职业类型', type: 'string', sample: '工薪' },
  { code: 'city_tier', label: '城市等级', type: 'string', sample: 'T1' },
  { code: 'fpd_score', label: '首逾评分', type: 'number', sample: '720' },
  { code: 'fraud_score', label: '欺诈评分', type: 'number', sample: '120' },
  { code: 'product_code', label: '产品编码', type: 'string', sample: 'PROD_A' },
  { code: 'is_repeat_apply', label: '是否复贷', type: 'boolean', sample: 'true' },
];

// 业务场景选项
export const businessCodeOptions = [
  { value: 'all', label: '全部场景' },
  { value: 'credit_apply', label: '授信申请' },
  { value: 'loan_apply', label: '借款申请' },
  { value: 'withdraw', label: '提现审核' },
  { value: 'repay', label: '还款检测' },
];

// 客户标签选项（AB测试分流种子）
export const customerTagOptions = [
  { value: 'all', label: '全部客户' },
  { value: 'seed_a', label: 'A组（种子A）' },
  { value: 'seed_b', label: 'B组（种子B）' },
  { value: 'new_user', label: '新客户' },
  { value: 'vip', label: 'VIP客户' },
];

// 拒绝原因分布
export const mockRejectReasons: RejectReasonItem[] = [
  { code: 'REJ_001', label: '信用分低于阈值', count: 1280, percentage: 32.5 },
  { code: 'REJ_002', label: '多头借贷过多', count: 892, percentage: 22.6 },
  { code: 'REJ_003', label: '命中黑名单', count: 540, percentage: 13.7 },
  { code: 'REJ_004', label: '设备异常', count: 420, percentage: 10.7 },
  { code: 'REJ_005', label: '收入不足', count: 356, percentage: 9.0 },
  { code: 'REJ_006', label: '年龄不符合', count: 248, percentage: 6.3 },
  { code: 'REJ_007', label: '其他原因', count: 204, percentage: 5.2 },
];

// 授信额度分布
export const mockCreditLimitDistribution: DistributionBucket[] = [
  { range: '0-1万', count: 320, percentage: 8.2 },
  { range: '1-3万', count: 980, percentage: 25.1 },
  { range: '3-5万', count: 1420, percentage: 36.4 },
  { range: '5-10万', count: 820, percentage: 21.0 },
  { range: '10-20万', count: 280, percentage: 7.2 },
  { range: '20万以上', count: 80, percentage: 2.1 },
];

// 定价分布（年化利率）
export const mockPricingDistribution: DistributionBucket[] = [
  { range: '<12%', count: 180, percentage: 4.6 },
  { range: '12-15%', count: 620, percentage: 15.9 },
  { range: '15-18%', count: 1280, percentage: 32.8 },
  { range: '18-21%', count: 1050, percentage: 26.9 },
  { range: '21-24%', count: 580, percentage: 14.9 },
  { range: '24%以上', count: 190, percentage: 4.9 },
];

// 节点通过率（规则节点的 verdict）
export const mockNodeVerdicts: NodeVerdictItem[] = [
  { nodeId: 'n1', nodeName: '基础信息校验', total: 10000, passCount: 9850, passRate: 98.5 },
  { nodeId: 'n2', nodeName: '黑名单校验', total: 9850, passCount: 9310, passRate: 94.5 },
  { nodeId: 'n3', nodeName: '反欺诈模型', total: 9310, passCount: 8890, passRate: 95.5 },
  { nodeId: 'n4', nodeName: '信用分评估', total: 8890, passCount: 7610, passRate: 85.6 },
  { nodeId: 'n5', nodeName: '多头借贷检测', total: 7610, passCount: 6720, passRate: 88.3 },
  { nodeId: 'n6', nodeName: '收入稳定性', total: 6720, passCount: 6360, passRate: 94.6 },
  { nodeId: 'n7', nodeName: '设备环境检测', total: 6360, passCount: 5940, passRate: 93.4 },
  { nodeId: 'n8', nodeName: '行为特征分析', total: 5940, passCount: 5580, passRate: 93.9 },
  { nodeId: 'n9', nodeName: '关联图谱分析', total: 5580, passCount: 5324, passRate: 95.4 },
  { nodeId: 'n10', nodeName: '额度定价计算', total: 5324, passCount: 5320, passRate: 99.9 },
];

// 规则命中排行
export const mockRuleHits: RuleHitItem[] = [
  { ruleId: 'r1', ruleCode: 'RULE_CR_001', ruleName: '信用分低于600', hitCount: 2840, rank: 1, trend: 5.2 },
  { ruleId: 'r2', ruleCode: 'RULE_DL_003', ruleName: '多头借贷大于5家', hitCount: 1920, rank: 2, trend: -3.1 },
  { ruleId: 'r3', ruleCode: 'RULE_BL_002', ruleName: '命中行业黑名单', hitCount: 1560, rank: 3, trend: 12.5 },
  { ruleId: 'r4', ruleCode: 'RULE_DV_005', ruleName: '设备ROOT风险', hitCount: 1340, rank: 4, trend: 8.3 },
  { ruleId: 'r5', ruleCode: 'RULE_IN_004', ruleName: '月收入小于5000', hitCount: 1180, rank: 5, trend: -1.2 },
  { ruleId: 'r6', ruleCode: 'RULE_AG_001', ruleName: '年龄超过60岁', hitCount: 980, rank: 6, trend: 2.1 },
  { ruleId: 'r7', ruleCode: 'RULE_FR_006', ruleName: '疑似欺诈特征', hitCount: 860, rank: 7, trend: 15.6 },
  { ruleId: 'r8', ruleCode: 'RULE_BH_002', ruleName: '夜间活跃异常', hitCount: 720, rank: 8, trend: -5.4 },
  { ruleId: 'r9', ruleCode: 'RULE_LC_001', ruleName: '高风险地区', hitCount: 680, rank: 9, trend: 3.8 },
  { ruleId: 'r10', ruleCode: 'RULE_RL_003', ruleName: '关联账户异常', hitCount: 620, rank: 10, trend: 7.2 },
  { ruleId: 'r11', ruleCode: 'RULE_AP_004', ruleName: '申请频次过高', hitCount: 580, rank: 11, trend: -2.8 },
  { ruleId: 'r12', ruleCode: 'RULE_IP_002', ruleName: 'IP地址代理', hitCount: 520, rank: 12, trend: 9.1 },
  { ruleId: 'r13', ruleCode: 'RULE_CT_001', ruleName: '通讯录异常', hitCount: 480, rank: 13, trend: 1.5 },
  { ruleId: 'r14', ruleCode: 'RULE_GP_003', ruleName: 'GPS位置异常', hitCount: 420, rank: 14, trend: -4.2 },
  { ruleId: 'r15', ruleCode: 'RULE_EM_001', ruleName: '邮箱未验证', hitCount: 380, rank: 15, trend: 0.8 },
  { ruleId: 'r16', ruleCode: 'RULE_SM_002', ruleName: '社保断缴', hitCount: 340, rank: 16, trend: 6.3 },
  { ruleId: 'r17', ruleCode: 'RULE_HS_001', ruleName: '历史逾期记录', hitCount: 320, rank: 17, trend: -7.1 },
  { ruleId: 'r18', ruleCode: 'RULE_CR_008', ruleName: '授信未激活', hitCount: 280, rank: 18, trend: 4.5 },
  { ruleId: 'r19', ruleCode: 'RULE_DV_007', ruleName: '设备指纹冲突', hitCount: 260, rank: 19, trend: 11.2 },
  { ruleId: 'r20', ruleCode: 'RULE_BK_001', ruleName: '银行卡风险', hitCount: 240, rank: 20, trend: 2.9 },
];

// 按粒度生成当日趋势数据（hour: 24个点, minute: 过去60分钟）
export function generateTrendByGranularity(
  baseValue: number,
  granularity: MonitoringGranularity,
  variance = 0.3,
): MetricTrendPoint[] {
  const data: MetricTrendPoint[] = [];
  if (granularity === 'hour') {
    for (let h = 0; h < 24; h++) {
      const factor = 1 + (Math.random() - 0.5) * variance;
      const hourFactor = h >= 9 && h <= 22 ? 1.2 : 0.6;
      data.push({
        time: `${h.toString().padStart(2, '0')}:00`,
        value: Math.round(baseValue * factor * hourFactor),
        compareValue: Math.round(baseValue * factor * hourFactor * 0.92),
      });
    }
  } else {
    // 按分钟：最近 60 分钟
    const now = new Date();
    for (let i = 59; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60 * 1000);
      const factor = 1 + (Math.random() - 0.5) * variance;
      // 分钟级别基数按 1/60 缩放
      const per = baseValue / 60;
      data.push({
        time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
        value: Math.max(0, Math.round(per * factor * 2)),
        compareValue: Math.max(0, Math.round(per * factor * 2 * 0.92)),
      });
    }
  }
  return data;
}

// TP耗时趋势（多线）
export interface LatencyTrendPoint {
  time: string;
  tp50: number;
  tp95: number;
  tp99: number;
}

export function generateLatencyTrend(granularity: MonitoringGranularity = 'hour'): LatencyTrendPoint[] {
  const data: LatencyTrendPoint[] = [];
  if (granularity === 'hour') {
    for (let h = 0; h < 24; h++) {
      const factor = 1 + (Math.random() - 0.5) * 0.2;
      data.push({
        time: `${h.toString().padStart(2, '0')}:00`,
        tp50: Math.round(20 * factor),
        tp95: Math.round(48 * factor),
        tp99: Math.round(62 * factor),
      });
    }
  } else {
    const now = new Date();
    for (let i = 59; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60 * 1000);
      const factor = 1 + (Math.random() - 0.5) * 0.25;
      data.push({
        time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
        tp50: Math.round(20 * factor),
        tp95: Math.round(48 * factor),
        tp99: Math.round(62 * factor),
      });
    }
  }
  return data;
}

// 饼图颜色池（使用 HSL 语义色）
export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--muted-foreground))',
];
