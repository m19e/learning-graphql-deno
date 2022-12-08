-- create type public.category as enum (
--   'SELFIE',
--   'PORTRAIT',
--   'ACTION',
--   'LANDSCAPE',
--   'GRAPHIC'
-- );
-- create table public.photos (
--     id integer primary key generated always as identity,
--     name text not null,
--     description text,
--     category category,
--     github_user text not null,
--     created date
-- );

insert into public.users (name, github_login)
values
  ('Rio Tsukatsuki', 'rTsukatsuki'),
  ('Himari Akeboshi', 'hAkeboshi'),
  ('Yuuka Hayase', 'yHayase'),
  ('Noa Ushio', 'nUshio');

insert into public.photos (name, description, category, github_user, created)
values
  ('photo/1 name', 'photo/1 description', 'PORTRAIT', 'hAkeboshi', '11-23-2032'),
  ('photo/2 name', 'photo/2 description', 'SELFIE', 'nUshio', '11-25-2032'),
  ('photo/3 name', 'photo/3 description', 'PORTRAIT', 'yHayase', '11-26-2032')
