export interface Store {
  store_address: string;
  store_name: string;
  store_id: string;
  chain_id: string;
  deleted: number;
}

export interface StoreAdmin extends Store {
  sales: number;
}

export interface Chain {
  chain_id: string;
  chain_name: string;
  url: string;
  stores: Store[];
  deleted: number;
}

export interface CreateChainModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: (newChain: Chain[]) => void;
}

export interface ChainCardProps {
  chain: Chain;
  stores: Store[];
  addStoreLocal: any;
}

export interface ChainAdmin extends Chain {
  chain_sales: number;
}

export interface ChainCardAdminProps {
  chain: ChainAdmin;
  deleteChain: any;
  stores: StoreAdmin[];
  deleteStore: (storeID: string, chainID: string) => void;
  addStoreLocal: (chainID: string, name: string, address: string) => void;
}

export interface ShoppingListInterface {
  shopping_list_id: string;
  list_name: string;
  shopper_id: string;
}

export interface ShoppingListEntries {
  list_entry_id: string;
  list_entry_name: string;
  list_entry_quantity: number;
  shopping_list_id: string;
  datetime_edited: string;
}

export interface ShoppingListDeal {
  item_id: string
  item_name: string
  item_category: string
  unit_price: number
  store_id: string
  store_address: string
  store_name: string
}

export interface ShoppingListInterface {
  shopping_list_id: string;
  list_name: string;
  shopper_id: string;
}

export interface ShoppingListEntries {
  list_entry_id: string;
  list_entry_name: string;
  list_entry_quantity: number;
  shopping_list_id: string;
  datetime_edited: string;
}

export interface ShoppingListDeal {
  item_id: string
  item_name: string
  item_category: string
  unit_price: number
  store_id: string
  store_address: string
  store_name: string
}