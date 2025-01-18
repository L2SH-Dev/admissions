\set pguser `echo "supabase_admin"`

create schema if not exists _realtime;
alter schema _realtime owner to :pguser;