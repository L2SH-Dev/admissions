create or replace function get_allocation(e_id bigint)
returns integer
language sql
security definer set search_path = ''
as $$
    select count(*) from public.exam_registrations where exam_id = e_id;
$$;