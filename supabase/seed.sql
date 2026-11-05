-- No live demo accounts or passwords are inserted. Create users with Supabase Auth.
insert into institutions(id,name) values('10000000-0000-4000-8000-000000000001','Sample Engineering College') on conflict do nothing;
insert into campuses(id,institution_id,name) values('10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','Main Campus') on conflict do nothing;
-- Browser demo data lives in src/data/seed.ts. Register merchants with verified accounts in live mode.
