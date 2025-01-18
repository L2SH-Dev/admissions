\set pguser `echo "supabase_admin"`
\c _supabase
create schema if not exists _supavisor;
alter schema _supavisor owner to :pguser;