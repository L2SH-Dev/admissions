-- policy command: ALL
create policy "Admins can do anything"
on "public"."exams"
as PERMISSIVE
for ALL
to authenticated
using (
    (( SELECT uid() AS uid) IN ( SELECT user_roles.user_id FROM user_roles WHERE (user_roles.role = 'admin'::app_role)))
);