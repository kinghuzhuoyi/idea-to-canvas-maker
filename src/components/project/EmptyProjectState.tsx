import { FolderOpen, ArrowLeft } from 'lucide-react';

export function EmptyProjectState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse">
          <ArrowLeft className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-2">选择一个项目</h3>
      <p className="text-muted-foreground max-w-sm">
        从左侧项目列表中选择一个项目，查看项目详情和策略列表
      </p>
    </div>
  );
}
