# 前端页面设计文档

## 1. 项目背景

本项目是一个基于 Vue 3 + TypeScript + Vite 的管理系统前端项目，主要功能包括：

- 左侧导航菜单的多级展示与页面跳转
- 表格展示监控数据，支持新增、刷新、搜索等操作
- 用户可以对监控数据进行修改、删除操作

## 2. 技术栈

- 核心框架：Vue 3
- 开发语言：TypeScript
- 构建工具：Vite
- UI 框架：Ant Design Vue (v4.x)
  - Layout: a-layout, a-layout-sider, a-layout-header, a-layout-content
  - Navigation: a-menu, a-breadcrumb
  - Data Display: a-table, a-card, a-descriptions
  - Data Entry: a-form, a-input, a-select
  - Feedback: a-modal, a-drawer, a-message
  - General: a-button, a-icon
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP 请求：Axios

## 3. 页面总体结构

### 3.1 布局区域划分

1. **左侧导航区**：

   - LOGO 区域
   - 多级菜单，支持展开和收缩
   - 可折叠控制

2. **主内容区**：
   - **头部导航栏**：
     - 左侧：面包屑导航
     - 右侧：用户信息、系统设置等
   - **内容展示区**：
     - 表格视图
       - 工具栏（新增、刷新、搜索等）
       - 数据展示区
       - 分页控制
     - 卡片视图
       - 响应式网格布局
       - 数据卡片展示
   - **弹出层**：
     - 右侧滑出抽屉
     - 配置表单
     - 确认对话框

## 4. 组件设计

### 4.1 布局组件（/layout）

1. **BaseLayout.vue**

   - 职责：最外层布局容器
   - 子组件：
     - SideNav
     - MainContent

2. **SideNav/index.vue**

   - 职责：左侧导航区管理
   - 子组件：
     - LogoArea
     - MenuTree

3. **MainContent/index.vue**
   - 职责：主内容区管理
   - 子组件：
     - HeaderNav
     - ContentArea

### 4.2 导航组件（/navigation）

1. **Breadcrumb.vue**

   - 职责：面包屑导航
   - 功能：
     - 动态路由显示
     - 路径导航

2. **UserInfo.vue**
   - 职责：用户信息 ��� 示
   - 功能：
     - 用户头像
     - 下拉菜单
     - 退出登录

### 4.3 数据展示组件（/display）

1. **Table 相关**

   - BaseTable.vue：基础表格
   - TableToolbar.vue：工具栏
   - TableOperations.vue：行操作

2. **Card 相关**
   - BaseCard.vue：基础卡片
   - CardList.vue：卡片列表

### 4.4 弹出层组件（/modal）

1. **SlideDrawer.vue**

   - 职责：右侧滑出抽屉
   - 功能：
     - 可配置宽度
     - 自定义内容

2. **ConfigForm.vue**
   - 职责：配置表单
   - 功能：
     - 动态表单项
     - 表单验证

### 4.5 通用组件（/common）

1. **SearchInput.vue**
2. **ActionButtons.vue**
3. **LoadingWrapper.vue**

## 5. 数据流设计

### 5.1 状态管理

使用 Pinia 进行状态管理，主要包括：

1. 用户状态
2. 菜单状态
3. 表格数据状态

### 5.2 数据通信

1. **组件通信**：

   - Props/Emit
   - Provide/Inject
   - Pinia Store

2. **API 通信**：
   - Axios 封装
   - 统一错误处理
   - 请求/响应拦截

## 6. 路由设计

### 6.1 路由结构

- 动态路由加载
- 路由守卫
- 权限控制

### 6.2 页面转场

- 路由动画
- 加载状态

## 7. 开发规范

### 7.1 代码规范

- ESLint 配置
- TypeScript 类型检查
- 命 ��� 规范

### 7.2 组件规范

- 单一职责
- 组件通信规范
- Props 类型定义

## 8. 下一步计划

1. **基础架构搭建**

   - 项目初始化
   - 基础组件开发

2. **核心功能实现**

   - 路由系统
   - 状态管理
   - 权限控制

3. **组件开发**

   - 按优先级实现各组件
   - 编写单元测试

4. **优化与完善**
   - 性能优化
   - 错误处理
   - 文档完善
