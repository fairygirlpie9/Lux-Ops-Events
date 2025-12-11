
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  LATE = 'LATE'
}

export interface Task {
  id: string;
  time: string;
  title: string;
  role: string;
  status: TaskStatus;
}

export enum FurnitureType {
  TABLE_ROUND = 'TABLE_ROUND',
  TABLE_RECT = 'TABLE_RECT',
  DANCE_FLOOR = 'DANCE_FLOOR',
  ENTRANCE = 'ENTRANCE'
}

export interface FloorItem {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  rotation: number;
  label?: string;
  guests?: number;
  assignedStaff?: string;
  warning?: string; // For compliance
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: string; // 'Manager', 'Staff', 'AI'
  text: string;
  timestamp: Date;
}

export interface EventState {
  tasks: Task[];
  floorItems: FloorItem[];
  messages: ChatMessage[];
}

export type ContractStatus = 'SIGNED' | 'PENDING' | 'DRAFT';

export interface Client {
  id: string;
  name: string;
  eventName: string;
  date: string;
  email: string;
  phone: string;
  guestCount: number;
  contractStatus: ContractStatus;
  notes: string;
}

export type NotificationType = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}
