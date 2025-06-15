create table "VoucherCode" (
  id serial primary key,
  voucher_code text unique not null,
  ticket_id_hash text unique
); 