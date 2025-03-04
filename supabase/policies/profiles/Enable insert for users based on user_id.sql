-- policy command: INSERT
policy "Enable insert for users based on user_id"
on "public"."profiles"
to authenticated
with check (
    (( SELECT uid() AS uid) = user_id)
);