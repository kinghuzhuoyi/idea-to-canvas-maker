import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { mockStrategies, mockProjects } from '@/data/mockData';
import { 
  mockStrategyDetailMetrics, 
  mockStrategyVersions, 
  mockVersionReleaseRecords, 
  mockStrategyChangeRecords,
  mockMetricsTrend,
  getDefaultMetrics,
  getDefaultTrendData,
} from '@/data/mockStrategyDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { OverviewTab } from '@/components/strategy/OverviewTab';
import { MonitoringTab } from '@/components/strategy/MonitoringTab';
import { VersionTab } from '@/components/strategy/VersionTab';
import { ArrowLeft, Hash, Activity, BarChart3, GitBranch } from 'lucide-react';

export default function StrategyDetail() {
  const { projectId, strategyId } = useParams<{ projectId: string; strategyId: string }>();
  const navigate = useNavigate();

  // 获取项目和策略数据
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === projectId);
  }, [projectId]);

  const strategy = useMemo(() => {
    if (!projectId) return null;
    const strategies = mockStrategies[projectId] || [];
    return strategies.find(s => s.id === strategyId);
  }, [projectId, strategyId]);

  const userRole = project?.userRole || 'viewer';

  // 获取策略详情数据
  const metrics = mockStrategyDetailMetrics[strategyId || ''] || getDefaultMetrics();
  const versions = mockStrategyVersions[strategyId || ''] || [];
  const releaseRecords = mockVersionReleaseRecords[strategyId || ''] || [];
  const changeRecords = mockStrategyChangeRecords[strategyId || ''] || [];
  const trendData = mockMetricsTrend[strategyId || ''] || getDefaultTrendData();

  if (!project || !strategy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">策略不存在</h2>
          <p className="text-muted-foreground mb-4">请检查链接是否正确</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* 面包屑导航 */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                项目列表
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                {project.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{strategy.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 头部信息 */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono">{strategy.code}</span>
                </div>
                <Badge variant={strategy.referenced ? 'referenced' : 'unreferenced'}>
                  {strategy.referenced ? '引用中' : '未引用'}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{strategy.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{strategy.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              实时监控
            </TabsTrigger>
            <TabsTrigger value="versions" className="gap-2">
              <GitBranch className="h-4 w-4" />
              版本管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              strategy={strategy}
              metrics={metrics}
              releaseRecords={releaseRecords}
              changeRecords={changeRecords}
            />
          </TabsContent>

          <TabsContent value="monitoring">
            <MonitoringTab
              metrics={metrics}
              trendData={trendData}
            />
          </TabsContent>

          <TabsContent value="versions">
            <VersionTab
              versions={versions}
              userRole={userRole}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
