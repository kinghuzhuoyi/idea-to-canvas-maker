import { StrategyVersion } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Clock, Check } from 'lucide-react';

interface EffectiveVersionCardProps {
  version: StrategyVersion;
}

export function EffectiveVersionCard({ version }: EffectiveVersionCardProps) {
  return (
    <div className="relative rounded-lg border-l-4 border-l-primary bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-lg font-semibold text-foreground">
              {version.versionNumber}
            </span>
            <Badge variant="effective" className="gap-1">
              <Check className="h-3 w-3" />
              正式
            </Badge>
          </div>
          
          {version.onlineTime && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>已在线时间：{version.onlineTime}</span>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            版本描述：{version.description}
          </p>
        </div>
      </div>
    </div>
  );
}
