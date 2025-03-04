-- policy command: SELECT
alter policy "Enable read access for all users"
on "public"."user_roles"
to public
using (
    true
);