import { useState, useMemo } from 'react';
import { RuleHitItem } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Search, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RuleHitTableProps {
  data: RuleHitItem[];
  totalApplications?: number; // 用于计算命中率
  onRowClick?: (rule: RuleHitItem) => void;
}

export function RuleHitTable({ data, totalApplications, onRowClick }: RuleHitTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.ruleName.toLowerCase().includes(q) ||
        r.ruleCode.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            规则命中排行
            <span className="text-xs font-normal text-muted-foreground">
              共 {data.length} 条规则
            </span>
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索规则名称或编码"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[440px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-16">排名</TableHead>
                <TableHead>规则编码</TableHead>
                <TableHead>规则名称</TableHead>
                <TableHead className="text-right">命中数</TableHead>
                <TableHead className="text-right w-24">命中率</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rule) => {
                const hitRate = totalApplications && totalApplications > 0
                  ? (rule.hitCount / totalApplications) * 100
                  : 0;
                return (
                  <TableRow
                    key={rule.ruleId}
                    className={cn(onRowClick && 'cursor-pointer')}
                    onClick={() => onRowClick?.(rule)}
                  >
                    <TableCell>
                      <Badge
                        variant={rule.rank <= 3 ? 'default' : 'outline'}
                        className={cn(
                          'w-8 justify-center tabular-nums',
                          rule.rank === 1 && 'bg-amber-500 hover:bg-amber-500',
                          rule.rank === 2 && 'bg-slate-400 hover:bg-slate-400',
                          rule.rank === 3 && 'bg-orange-600 hover:bg-orange-600'
                        )}
                      >
                        {rule.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        {rule.ruleCode}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{rule.ruleName}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {rule.hitCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">
                      {hitRate.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {onRowClick && (
                        <FileSearch className="h-3.5 w-3.5 text-muted-foreground inline" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    未找到匹配的规则
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
