export interface MenuItem {
  id: string;
  label: string;
  url: string;
  children: MenuItem[];
  isExpanded?: boolean;
  isEditing?: boolean;
  cssClass?: string;
}

export interface PageItem {
  id: string;
  name: string;
  url: string;
}