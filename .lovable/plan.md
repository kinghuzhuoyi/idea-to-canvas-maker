
## 撤回申请二次确认弹窗实现方案

---

### 需求分析

当前系统中有两处撤回申请操作：
1. **项目加入申请撤回** - 在 `PendingProjectDetail` 组件中
2. **权限升级申请撤回** - 在 `UpgradeProgressCard` 组件中

这两处目前都是点击后直接执行，没有二次确认。为防止用户误操作，需要添加确认弹窗。

---

### 实现方案

#### 新建组件：`WithdrawConfirmDialog.tsx`

创建一个通用的撤回确认弹窗组件，支持不同类型的撤回场景：

| 属性 | 说明 |
|------|------|
| `type` | 撤回类型：`'application'`（加入申请）或 `'upgrade'`（权限升级） |
| `projectName` | 项目名称，用于显示在确认信息中 |
| `open` | 控制弹窗开关 |
| `onOpenChange` | 开关状态变更回调 |
| `onConfirm` | 确认撤回回调 |

弹窗内容根据类型显示不同文案：
- **加入申请**：「您确定要撤回加入「{projectName}」的申请吗？撤回后如需重新加入需要再次提交申请。」
- **权限升级**：「您确定要撤回权限升级申请吗？撤回后如需升级权限需要重新提交申请。」

---

### 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `src/components/project/WithdrawConfirmDialog.tsx` | 新建通用撤回确认弹窗组件 |
| `src/pages/Index.tsx` | 添加撤回确认弹窗状态管理和组件引用 |
| `src/components/project/PendingProjectDetail.tsx` | 无需修改（逻辑在父组件处理） |
| `src/components/project/UpgradeProgressCard.tsx` | 无需修改（逻辑在父组件处理） |

---

### 技术细节

#### 1. 新建 `WithdrawConfirmDialog.tsx`

```text
组件结构：
├── AlertDialog（来自 shadcn/ui）
│   ├── AlertDialogContent
│   │   ├── AlertDialogHeader
│   │   │   ├── 图标区域（Undo2 图标，warning 配色）
│   │   │   ├── AlertDialogTitle（确认撤回申请）
│   │   │   └── AlertDialogDescription（根据类型显示不同文案）
│   │   └── AlertDialogFooter
│   │       ├── AlertDialogCancel（取消）
│   │       └── AlertDialogAction（确认撤回，destructive 样式）
```

#### 2. 修改 `Index.tsx`

```text
新增状态：
- withdrawDialogOpen: boolean  // 控制撤回确认弹窗
- withdrawType: 'application' | 'upgrade' | null  // 撤回类型

修改处理函数：
- handleWithdrawApplication：改为打开确认弹窗
- handleWithdrawUpgrade：改为打开确认弹窗
- 新增 confirmWithdraw：实际执行撤回逻辑
```

---

### 用户交互流程

```text
用户点击"撤回申请"按钮
        ↓
    弹出确认弹窗
        ↓
    ┌─────────────────┐
    │  确认撤回申请？   │
    │                 │
    │  [取消] [确认撤回]│
    └─────────────────┘
        ↓
   点击"确认撤回"
        ↓
    执行撤回操作
        ↓
    显示成功提示
```
