ALTER TABLE public.pos_order_items
  DROP CONSTRAINT pos_order_items_menu_item_id_fkey;

ALTER TABLE public.pos_order_items
  ADD CONSTRAINT pos_order_items_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES public.items(id);