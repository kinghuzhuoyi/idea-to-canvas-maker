import { useState, useEffect, useCallback, useRef } from 'react';
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

interface AddMemberFormProps {
  onAdd: (user: AvailableUser, role: UserRole) => void;
  onCancel: () => void;
  existingMemberEmails: string[];
}

export function AddMemberForm({ onAdd, onCancel, existingMemberEmails }: AddMemberFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AvailableUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer');
  const [searchResults, setSearchResults] = useState<AvailableUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsPopoverOpen(false);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const results = mockAvailableUsers.filter(user => 
        !existingMemberEmails.includes(user.email) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) ||
         user.email.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setIsPopoverOpen(true);
      setHighlightedIndex(-1);
      setIsSearching(false);
    }, 300);
  }, [existingMemberEmails]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedUser) {
        searchUsers(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers, selectedUser]);

  const handleSelectUser = (user: AvailableUser) => {
    setSelectedUser(user);
    setSearchQuery(user.email);
    setIsPopoverOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setSearchQuery('');
    setSearchResults([]);
    setIsPopoverOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAdd(selectedUser, selectedRole);
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

  const isNewEmail = searchQuery.includes('@') && 
    !mockAvailableUsers.some(u => u.email === searchQuery) &&
    !existingMemberEmails.includes(searchQuery);

  const allResults = isNewEmail 
    ? [...searchResults, { id: 'new', name: searchQuery.split('@')[0], email: searchQuery, isNew: true }]
    : searchResults;

  return (
    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          添加新成员
        </h4>
        <Button variant="ghost" size="icon-sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr,140px]">
        <div className="space-y-2">
          <Label htmlFor="memberEmail">搜索成员</Label>
          <Popover open={isPopoverOpen && !selectedUser} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  ref={inputRef}
                  id="memberEmail"
                  placeholder="输入姓名或邮箱搜索..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedUser) setSelectedUser(null);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchResults.length > 0 && !selectedUser) {
                      setIsPopoverOpen(true);
                    }
                  }}
                  className="pl-10 pr-10"
                />
                {(searchQuery || selectedUser) && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 z-10"
                    onClick={handleClearSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] p-0" 
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  搜索中...
                </div>
              ) : allResults.length > 0 ? (
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
          
          {selectedUser && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-sm animate-fade-in">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {selectedUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
              <span className="text-muted-foreground truncate">({selectedUser.email})</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-5 w-5 ml-auto"
                onClick={handleClearSelection}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>角色</Label>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <span className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-primary" />
                  管理者
                </span>
              </SelectItem>
              <SelectItem value="editor">
                <span className="flex items-center gap-2">
                  <Pencil className="h-3 w-3 text-success" />
                  编辑者
                </span>
              </SelectItem>
              <SelectItem value="viewer">
                <span className="flex items-center gap-2">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  查看者
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          取消
        </Button>
        <Button
          size="sm"
          variant="glow"
          onClick={handleSubmit}
          disabled={!selectedUser || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              添加中...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              确认添加
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
