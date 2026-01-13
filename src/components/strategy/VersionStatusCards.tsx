import { StrategyVersion, UserRole } from '@/types/project';
import { EffectiveVersionCard } from './EffectiveVersionCard';
import { ApprovingVersionCard } from './ApprovingVersionCard';
import { GrayscaleVersionCard } from './GrayscaleVersionCard';
import { toast } from 'sonner';

interface VersionStatusCardsProps {
  versions: StrategyVersion[];
  userRole: UserRole;
  onRefreshApproval?: (version: StrategyVersion) => void;
  onTerminateApproval?: (version: StrategyVersion) => void;
  onRefreshGrayscale?: (version: StrategyVersion) => void;
  onAdjustTraffic?: (version: StrategyVersion) => void;
  onFullPublish?: (version: StrategyVersion) => void;
  onRollbackGrayscale?: (version: StrategyVersion) => void;
}

export function VersionStatusCards({
  versions,
  userRole,
  onRefreshApproval,
  onTerminateApproval,
  onRefreshGrayscale,
  onAdjustTraffic,
  onFullPublish,
  onRollbackGrayscale,
}: VersionStatusCardsProps) {
  const effectiveVersion = versions.find(v => v.status === 'effective');
  const approvingVersion = versions.find(v => v.status === 'approving');
  const grayscaleVersion = versions.find(v => v.status === 'grayscale');

  const handleViewEffectiveDetail = () => {
    toast.info(`查看版本 ${effectiveVersion?.versionNumber} 详情`);
  };

  // If no status cards to show, return null
  if (!effectiveVersion && !approvingVersion && !grayscaleVersion) {
    return null;
  }

  return (
    <div className="space-y-4">
      {effectiveVersion && (
        <EffectiveVersionCard 
          version={effectiveVersion}
          onViewDetail={handleViewEffectiveDetail}
        />
      )}
      
      {approvingVersion && (
        <ApprovingVersionCard 
          version={approvingVersion}
          userRole={userRole}
          onRefresh={() => onRefreshApproval?.(approvingVersion)}
          onTerminate={() => onTerminateApproval?.(approvingVersion)}
        />
      )}
      
      {grayscaleVersion && (
        <GrayscaleVersionCard 
          version={grayscaleVersion}
          userRole={userRole}
          onRefresh={() => onRefreshGrayscale?.(grayscaleVersion)}
          onAdjustTraffic={() => onAdjustTraffic?.(grayscaleVersion)}
          onFullPublish={() => onFullPublish?.(grayscaleVersion)}
          onRollback={() => onRollbackGrayscale?.(grayscaleVersion)}
        />
      )}
    </div>
  );
}
