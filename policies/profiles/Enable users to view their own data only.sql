-- policy command: SELECT
policy "Enable users to view their own data only"
on "public"."profiles"
to authenticated
using (
    (( SELECT uid() AS uid) = user_id)
);