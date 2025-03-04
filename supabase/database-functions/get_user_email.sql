-- schema: public
-- return type: varchar
-- arguments: [ (user_id uuid) ]
-- language: sql
-- configuration parameters: [ (search_path '') ]
-- security: definer
select email from auth.users where id = user_id;