import { StatusTab } from './status-tab';

export interface TableHeaderProps {
  title?: string;
  statusTabs?: StatusTab[];
  currentTab: number;
  onTabChange: (newValue: number) => void;
} 