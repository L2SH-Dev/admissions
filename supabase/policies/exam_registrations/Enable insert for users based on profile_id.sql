-- policy command: SELECT
create policy "Enable insert for users based on profile_id"
on "public"."exam_registrations"
as PERMISSIVE
for INSERT
to authenticated
with check (
    (profile_id IN ( SELECT profiles.id FROM profiles WHERE (profiles.user_id = ( SELECT uid() AS uid))))
);