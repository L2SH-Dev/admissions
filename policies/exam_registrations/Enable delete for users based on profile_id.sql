-- policy command: DELETE
create policy "Enable delete for users based on profile_id"
on "public"."exam_registrations"
as PERMISSIVE
for DELETE
to authenticated
using (
    (profile_id IN ( SELECT profiles.id FROM profiles WHERE (profiles.user_id = ( SELECT uid() AS uid))))
);