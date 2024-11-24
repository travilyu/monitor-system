import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { DashboardCard } from '@/types/dashboard'

export function useDashboard() {
  const formRef = ref()
  const state = reactive({
    loading: false,
    cards: [] as DashboardCard[],
    drawer: {
      visible: false,
      title: '',
      initialValues: {} as Partial<DashboardCard>,
    },
  })

  // 加载卡片数据
  const loadData = async () => {
    state.loading = true
    try {
      // 模拟数据
      state.cards = Array(6)
        .fill(0)
        .map((_, index) => ({
          id: index + 1,
          name: `统计卡片 ${index + 1}`,
          data: {
            charts: Array(6)
              .fill(0)
              .map((_, chartIndex) => ({
                title: `指标 ${chartIndex + 1}`,
                data: generateMockChartData(),
              })),
            summary: `这是统计卡片 ${index + 1} 的总结信息`,
          },
          loading: false,
        }))
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      state.loading = false
    }
  }

  // 生成模拟图表数据
  const generateMockChartData = () => {
    const now = new Date()
    return Array(7)
      .fill(0)
      .map((_, index) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (6 - index))
        return {
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100),
        }
      })
  }

  // 刷新单个卡片
  const handleRefresh = async (card: DashboardCard) => {
    card.loading = true
    try {
      // 模拟刷新
      await new Promise((resolve) => setTimeout(resolve, 1000))
      card.data.charts = card.data.charts.map((chart) => ({
        ...chart,
        data: generateMockChartData(),
      }))
      message.success('刷新成功')
    } catch (error) {
      message.error('刷新失败')
    } finally {
      card.loading = false
    }
  }

  // 编辑卡片
  const handleEdit = (card: DashboardCard) => {
    state.drawer.title = '编辑统计卡片'
    state.drawer.initialValues = { ...card }
    state.drawer.open = true
  }

  // 处理抽屉提交
  const handleDrawerSubmit = async (values: DashboardCard) => {
    try {
      // 模拟保存
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const index = state.cards.findIndex((card) => card.id === values.id)
      if (index !== -1) {
        state.cards[index] = { ...state.cards[index], ...values }
      }
      state.drawer.open = false
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    }
  }

  return {
    formRef,
    state,
    loadData,
    handleRefresh,
    handleEdit,
    handleDrawerSubmit,
  }
}
