import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FolderPlus, Search, Users, FileCode, Check, Loader2, X, FolderOpen, Pencil, Eye } from 'lucide-react';
import { mockSearchableProjects } from '@/data/mockData';
import { Project, UserRole } from '@/types/project';

type RequestRole = 'editor' | 'viewer';

interface JoinProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectCode: string, reason: string, requestedRole: RequestRole) => void;
}

export function JoinProjectModal({ open, onOpenChange, onSubmit }: JoinProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('');
  const [requestedRole, setRequestedRole] = useState<RequestRole>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 防抖搜索
  const searchProjects = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = mockSearchableProjects.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.id.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
      setIsSearching(false);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedProject) {
        searchProjects(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProjects, selectedProject]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setSearchQuery(project.name);
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    setSelectedProject(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedProject) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(selectedProject.id, reason, requestedRole);
    setIsSubmitting(false);
    setSearchQuery('');
    setReason('');
    setRequestedRole('editor');
    setSelectedProject(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSearchQuery('');
    setReason('');
    setRequestedRole('editor');
    setSelectedProject(null);
    setSearchResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <FolderPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>加入项目</DialogTitle>
          <DialogDescription>
            搜索公开项目并提交加入申请
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectSearch">搜索项目</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="projectSearch"
                placeholder="输入项目名称或代码搜索..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedProject) setSelectedProject(null);
                }}
                className="pl-10 pr-10"
              />
              {(searchQuery || selectedProject) && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={handleClearSelection}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* 搜索结果 */}
            {searchQuery && !selectedProject && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {isSearching ? (
                  <div className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    搜索中...
                  </div>
                ) : searchResults.length > 0 ? (
                  <ScrollArea className="max-h-64">
                    <div className="divide-y divide-border">
                      {searchResults.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          className="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => handleSelectProject(project)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FolderOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium mb-1">{project.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {project.description}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {project.memberCount} 成员
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileCode className="h-3 w-3" />
                                  {project.strategyCount} 策略
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">未找到匹配的项目</div>
                    <div className="text-xs mt-1">请尝试其他关键词</div>
                  </div>
                )}
              </div>
            )}

            {/* 已选择的项目 */}
            {selectedProject && (
              <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{selectedProject.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {selectedProject.description}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {selectedProject.memberCount} 成员
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        {selectedProject.strategyCount} 策略
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 申请权限选择 */}
          <div className="space-y-3">
            <Label>申请权限</Label>
            <RadioGroup 
              value={requestedRole} 
              onValueChange={(value) => setRequestedRole(value as RequestRole)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="role-editor"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  requestedRole === 'editor' 
                    ? 'border-success bg-success/5' 
                    : 'border-border hover:border-success/50'
                }`}
              >
                <RadioGroupItem value="editor" id="role-editor" className="sr-only" />
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  requestedRole === 'editor' ? 'bg-success/20' : 'bg-muted'
                }`}>
                  <Pencil className={`h-5 w-5 ${requestedRole === 'editor' ? 'text-success' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${requestedRole === 'editor' ? 'text-success' : ''}`}>编辑者</div>
                  <div className="text-xs text-muted-foreground">可编辑策略配置</div>
                </div>
                {requestedRole === 'editor' && <Check className="h-4 w-4 text-success" />}
              </Label>
              
              <Label
                htmlFor="role-viewer"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  requestedRole === 'viewer' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="viewer" id="role-viewer" className="sr-only" />
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  requestedRole === 'viewer' ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Eye className={`h-5 w-5 ${requestedRole === 'viewer' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${requestedRole === 'viewer' ? 'text-primary' : ''}`}>查看者</div>
                  <div className="text-xs text-muted-foreground">仅可查看策略</div>
                </div>
                {requestedRole === 'viewer' && <Check className="h-4 w-4 text-primary" />}
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">申请理由（可选）</Label>
            <Textarea
              id="reason"
              placeholder="简要说明加入项目的原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedProject || isSubmitting}
            variant="glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              '提交申请'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
