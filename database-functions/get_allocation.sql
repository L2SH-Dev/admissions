-- schema: public
-- return type: integer
-- arguments: [ (e_id int4) ]
-- language: sql
-- configuration parameters: [ (search_path '') ]
-- security: definer
select count(*) from public.exam_registrations where exam_id = e_id;