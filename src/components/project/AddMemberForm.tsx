import { useState, useEffect, useCallback } from 'react';
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
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 防抖搜索
  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = mockAvailableUsers.filter(user => 
        !existingMemberEmails.includes(user.email) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) ||
         user.email.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setShowResults(true);
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
    setShowResults(false);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAdd(selectedUser, selectedRole);
    setIsSubmitting(false);
  };

  const isNewEmail = searchQuery.includes('@') && 
    !mockAvailableUsers.some(u => u.email === searchQuery) &&
    !existingMemberEmails.includes(searchQuery);

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="memberEmail"
              placeholder="输入姓名或邮箱搜索..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedUser) setSelectedUser(null);
              }}
              className="pl-10 pr-10"
            />
            {(searchQuery || selectedUser) && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={handleClearSelection}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* 搜索结果下拉 */}
            {showResults && !selectedUser && (
              <div className="absolute z-50 w-full mt-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
                {isSearching ? (
                  <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    搜索中...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                        onClick={() => handleSelectUser(user)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : isNewEmail ? (
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      邀请新用户
                    </div>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left border border-dashed border-border"
                      onClick={() => handleSelectUser({ id: 'new', name: searchQuery.split('@')[0], email: searchQuery })}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          +
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">发送邀请</div>
                        <div className="text-xs text-muted-foreground truncate">{searchQuery}</div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    未找到匹配的用户
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedUser && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {selectedUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
              <span className="text-muted-foreground">({selectedUser.email})</span>
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
