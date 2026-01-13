import { useState } from 'react';
import { StrategyVersion } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Check, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EffectiveVersionCardProps {
  version: StrategyVersion;
  onViewDetail?: () => void;
}

export function EffectiveVersionCard({ version, onViewDetail }: EffectiveVersionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const healthStatus = version.healthStatus || 'healthy';

  const healthConfig = {
    healthy: { color: 'bg-emerald-500', label: '健康', pulse: true },
    warning: { color: 'bg-amber-500', label: '警告', pulse: true },
    error: { color: 'bg-destructive', label: '异常', pulse: true },
  };

  const health = healthConfig[healthStatus];

  const handleCopy = () => {
    toast.success(`版本 ${version.versionNumber} 配置已复制到剪贴板`);
  };

  const handleExport = () => {
    toast.success(`版本 ${version.versionNumber} 已导出`);
  };

  // 解析在线时长用于高亮显示
  const formatOnlineTime = (time?: string) => {
    if (!time) return null;
    const parts = time.match(/(\d+)天(\d+)小时(\d+)分钟/);
    if (parts) {
      return (
        <span className="font-mono">
          <span className="text-xl font-bold text-primary">{parts[1]}</span>
          <span className="text-sm text-muted-foreground">天</span>
          <span className="text-xl font-bold text-primary ml-1">{parts[2]}</span>
          <span className="text-sm text-muted-foreground">小时</span>
          <span className="text-xl font-bold text-primary ml-1">{parts[3]}</span>
          <span className="text-sm text-muted-foreground">分钟</span>
        </span>
      );
    }
    return <span className="text-foreground">{time}</span>;
  };

  return (
    <div className="relative rounded-lg border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {/* Health Indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="relative flex items-center justify-center">
                    <span className={`h-3 w-3 rounded-full ${health.color} ${health.pulse ? 'animate-pulse' : ''}`} />
                    {health.pulse && (
                      <span className={`absolute h-3 w-3 rounded-full ${health.color} animate-ping opacity-75`} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>版本状态：{health.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="font-mono text-lg font-semibold text-foreground">
              {version.versionNumber}
            </span>
            <Badge variant="effective" className="gap-1">
              <Check className="h-3 w-3" />
              正式生效
            </Badge>
          </div>
          
          {version.onlineTime && (
            <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-muted/50">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">已稳定运行：</span>
              {formatOnlineTime(version.onlineTime)}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            版本描述：{version.description}
          </p>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border space-y-3 animate-in slide-in-from-top-2 duration-200">
              <h4 className="text-sm font-medium text-foreground">版本规则摘要</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">发布时间：</span>
                  <span className="text-foreground">{version.publishedAt || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">更新人：</span>
                  <span className="text-foreground">{version.updatedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">更新时间：</span>
                  <span className="text-foreground">{version.updatedAt}</span>
                </div>
                {version.tags && version.tags.length > 0 && (
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="text-muted-foreground">标签：</span>
                    <div className="flex gap-1">
                      {version.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>复制配置</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>导出版本</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onViewDetail}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>查看详情</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Expand Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-3 text-muted-foreground hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            收起详情
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            展开详情
          </>
        )}
      </Button>
    </div>
  );
}
