create or replace function get_available_exams(profile_id int4)
returns TABLE (id int4, created_at timestamptz, date date, start_time time, end_time time, capacity int4, grade int4, registration_is_open bool, annotation text, exam_type_id int4, title text)
language sql
set search_path = ''
as $$
  select
  exams.id,
  exams.created_at,
  exams.date,
  exams.start_time,
  exams.end_time,
  exams.capacity,
  exams.grade,
  exams.registration_is_open,
  exams.annotation,
  exams.exam_type_id,
  exam_types.title
  from public.exams
  join public.exam_types on exams.exam_type_id = exam_types.id
  where exams.grade = (
    select profiles.grade from public.profiles where id = profile_id
  )
  and exam_types.order = (
    select 0 as last_order
  ) + 1
  and exams.date > NOW() + INTERVAL '3 days'
  and exams.registration_is_open = true
  and public.get_allocation(exams.id) < exams.capacity;
$$;