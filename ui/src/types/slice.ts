export type SliceIdentifyType = 'IP_TUPLE' | 'APPLICATION'

export interface SliceFormState {
  name: string
  description?: string
  identifyType: SliceIdentifyType
  applications?: string[]
  sourceIpPort?: string
  protocol?: string
  destIpPort?: string
  bandwidth: number
  priority: number
  lineUuids: string[]
  nextHop: string
}

export interface SliceTableItem extends SliceFormState {
  id: string
  uuid: string
  createdAt: string
  updatedAt: string
}

export interface SliceState {
  loading: boolean
  drawer: {
    visible: boolean
    title: string
    initialValues?: Partial<SliceTableItem>
  }
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}
