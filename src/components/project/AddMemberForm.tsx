import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { mockAvailableUsers } from '@/data/mockData';
import { UserRole } from '@/types/project';
import { Search, X, UserPlus, Loader2, Mail, Shield, Pencil, Eye } from 'lucide-react';

interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

interface SelectedUserWithRole {
  user: AvailableUser;
  role: UserRole;
}

interface AddMemberFormProps {
  onAdd: (user: AvailableUser, role: UserRole) => void;
  onCancel: () => void;
  existingMemberEmails: string[];
}

// 将 RoleSelector 提取为独立的 memo 组件，避免重复渲染导致的闪烁
const RoleSelector = memo(({ value, onChange }: { value: UserRole; onChange: (role: UserRole) => void }) => (
  <Select value={value} onValueChange={(v) => onChange(v as UserRole)}>
    <SelectTrigger className="w-[100px] h-7 text-xs">
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="z-[200]">
      <SelectItem value="admin">
        <span className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-primary" />
          管理者
        </span>
      </SelectItem>
      <SelectItem value="editor">
        <span className="flex items-center gap-1.5">
          <Pencil className="h-3 w-3 text-success" />
          编辑者
        </span>
      </SelectItem>
      <SelectItem value="viewer">
        <span className="flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-muted-foreground" />
          查看者
        </span>
      </SelectItem>
    </SelectContent>
  </Select>
));
RoleSelector.displayName = 'RoleSelector';

export function AddMemberForm({ onAdd, onCancel, existingMemberEmails }: AddMemberFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserWithRole[]>([]);
  const [searchResults, setSearchResults] = useState<AvailableUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 使用 useMemo 缓存已选择的用户邮箱列表，避免每次渲染都创建新数组
  const selectedEmailsSet = useMemo(() => 
    new Set(selectedUsers.map(su => su.user.email)), 
    [selectedUsers]
  );
  
  // 使用 ref 存储最新的过滤条件，避免 useCallback 依赖变化导致的闪烁
  const filterRef = useRef({ existingMemberEmails, selectedEmailsSet });
  filterRef.current = { existingMemberEmails, selectedEmailsSet };

  // 防抖搜索 - 移除对 selectedEmails 的依赖，使用 ref 获取最新值
  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsPopoverOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const { existingMemberEmails, selectedEmailsSet } = filterRef.current;
    const results = mockAvailableUsers.filter(user => 
      !existingMemberEmails.includes(user.email) &&
      !selectedEmailsSet.has(user.email) &&
      (user.name.toLowerCase().includes(query.toLowerCase()) ||
       user.email.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
    setIsPopoverOpen(results.length > 0 || query.includes('@'));
    setHighlightedIndex(-1);
    setIsSearching(false);
  }, []);

  // 使用单一防抖 effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const handleSelectUser = (user: AvailableUser) => {
    setSelectedUsers(prev => [...prev, { user, role: 'viewer' }]);
    setSearchQuery('');
    setIsPopoverOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemoveUser = (email: string) => {
    setSelectedUsers(prev => prev.filter(su => su.user.email !== email));
  };

  const handleRoleChange = (email: string, role: UserRole) => {
    setSelectedUsers(prev => 
      prev.map(su => su.user.email === email ? { ...su, role } : su)
    );
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 批量添加所有选中的用户
    selectedUsers.forEach(({ user, role }) => {
      onAdd(user, role);
    });
    
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isPopoverOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleSelectUser(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsPopoverOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 使用 useMemo 缓存新邮箱判断和结果列表
  const isNewEmail = useMemo(() => 
    searchQuery.includes('@') && 
    !mockAvailableUsers.some(u => u.email === searchQuery) &&
    !existingMemberEmails.includes(searchQuery) &&
    !selectedEmailsSet.has(searchQuery),
    [searchQuery, existingMemberEmails, selectedEmailsSet]
  );

  const allResults = useMemo(() => 
    isNewEmail 
      ? [...searchResults, { id: 'new', name: searchQuery.split('@')[0], email: searchQuery, isNew: true }]
      : searchResults,
    [isNewEmail, searchResults, searchQuery]
  );

  return (
    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          添加新成员
          {selectedUsers.length > 0 && (
            <span className="text-xs text-muted-foreground">
              (已选 {selectedUsers.length} 人)
            </span>
          )}
        </h4>
        <Button variant="ghost" size="icon-sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 搜索输入 */}
      <div className="space-y-2">
        <Label htmlFor="memberEmail">搜索成员</Label>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={inputRef}
                id="memberEmail"
                placeholder="输入姓名或邮箱搜索，可添加多人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsPopoverOpen(true);
                  }
                }}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 z-10"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0 z-[200] bg-popover border border-border shadow-lg" 
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {allResults.length > 0 ? (
              <div className="max-h-64 overflow-y-auto py-1">
                {allResults.map((user, index) => {
                  const isNew = 'isNew' in user && user.isNew;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                        highlightedIndex === index 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelectUser(user)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className={`text-xs ${isNew ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                          {isNew ? '+' : user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {isNew ? '发送邮件邀请' : user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          {isNew && <Mail className="h-3 w-3" />}
                          {user.email}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                未找到匹配的用户
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* 已选用户列表 - 用户和角色在同一行 */}
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">待添加成员</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedUsers.map(({ user, role }) => (
              <div 
                key={user.email}
                className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border/50 animate-fade-in"
              >
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
                <RoleSelector value={role} onChange={(r) => handleRoleChange(user.email, r)} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => handleRemoveUser(user.email)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          取消
        </Button>
        <Button
          size="sm"
          variant="glow"
          onClick={handleSubmit}
          disabled={selectedUsers.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              添加中...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              确认添加 {selectedUsers.length > 0 && `(${selectedUsers.length})`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
