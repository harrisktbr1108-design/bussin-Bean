import { MenuItem } from './data/menu';
import { CartItem } from './components/OrderModal';

export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered' | 'Rejected';

export interface CustomerOrder {
  id: string;
  items: CartItem[];
  total: number;
  contactNumber?: string;
  address?: string;
  status: OrderStatus;
  createdAt: string;
  rejectionReason?: string;
}

export type MenuEditorItem = Omit<MenuItem, 'id'> & { id?: string };

export interface CustomerDiscount {
  id: string;
  customerKey: string;
  percent: number;
  label: string;
  active: boolean;
}
