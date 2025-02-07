-- policy command: SELECT
create policy "Enable users to view their own data only"
on "public"."exam_registrations"
as PERMISSIVE
for SELECT
to authenticated
using (
    profile_id IN ( SELECT id FROM public.profiles WHERE user_id = ( SELECT uid() AS uid) )
);