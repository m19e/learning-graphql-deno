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
