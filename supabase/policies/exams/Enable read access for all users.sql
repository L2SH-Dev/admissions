-- policy command: SELECT
create policy "Enable read access for all users"
on "public"."exams"
as PERMISSIVE
for SELECT
to authenticated
using (
    true
);