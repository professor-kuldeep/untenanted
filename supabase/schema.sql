-- =========================================================
-- UNTENANTED HEART CMS V5.2 — STANDALONE FRESH SCHEMA
-- Fresh Supabase project schema. No prior CMS version is required.
-- =========================================================
create extension if not exists pgcrypto;

-- ---------- Profiles / roles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  bio text default '',
  public_profile boolean not null default false,
  role text not null default 'member' check (role in ('super_admin','admin','editor','seo_manager','moderator','author','member')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '', -- legacy Markdown fallback
  content_blocks jsonb not null default '[]'::jsonb,
  search_text text not null default '',
  category text not null,
  emotion_tags text[] not null default '{}',
  featured_image text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','review','scheduled','published','archived')),
  author_id uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  og_image text,
  canonical_url text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  workflow_stage text not null default 'draft' check (workflow_stage in ('idea','assigned','draft','editorial_review','seo_review','scheduled','published')),
  editor_id uuid references public.profiles(id) on delete set null,
  seo_reviewer_id uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  tags text[] not null default '{}',
  featured_image_alt text,
  focus_keyword text,
  secondary_keywords text[] not null default '{}',
  breadcrumb_title text,
  og_title text,
  og_description text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  schema_type text not null default 'BlogPosting',
  faq_items jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_category_idx on public.posts(category);
create index if not exists posts_published_at_idx on public.posts(published_at desc);
create index if not exists posts_scheduled_at_idx on public.posts(scheduled_at);
create index if not exists posts_emotion_tags_gin on public.posts using gin(emotion_tags);

-- ---------- Topic / landing pages ----------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  symbol text default '♡',
  headline text not null,
  intro text default '',
  quote text default '',
  prompts jsonb not null default '[]'::jsonb,
  hero_image text,
  pinned_post_ids uuid[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  og_image text,
  canonical_url text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  focus_keyword text,
  breadcrumb_title text,
  og_title text,
  og_description text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  schema_type text not null default 'CollectionPage',
  faq_items jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Letters ----------
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  salutation text default 'Dear you,',
  body text not null,
  closing text,
  signature text,
  ps text,
  emotion text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Community ----------
create table if not exists public.community_notes (
  id uuid primary key default gen_random_uuid(),
  pen_name text default 'Anonymous',
  note text not null,
  emotion text,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  moderator_notes text,
  source text default '',
  medium text default '',
  campaign text default '',
  referrer text default '',
  landing_page text default '',
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  pen_name text default 'Anonymous',
  email text not null,
  title text not null,
  category text not null,
  story text not null,
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','rejected','converted')),
  admin_notes text,
  source text default '',
  medium text default '',
  campaign text default '',
  referrer text default '',
  landing_page text default '',
  converted_post_id uuid references public.posts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Site / homepage builder ----------
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  intro text,
  enabled boolean not null default true,
  sort_order int not null default 0,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_items (
  id uuid primary key default gen_random_uuid(),
  section_slug text not null references public.homepage_sections(slug) on update cascade on delete cascade,
  item_type text not null default 'card',
  label text,
  title text,
  body text,
  link_label text,
  link_url text,
  accent text,
  metadata jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists homepage_items_section_idx on public.homepage_items(section_slug,sort_order);

-- ---------- Media library ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  filename text not null,
  alt_text text default '',
  caption text default '',
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Revisions / audit ----------
create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  snapshot jsonb not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists content_revisions_entity_idx on public.content_revisions(entity_type,entity_id,created_at desc);

create table if not exists public.audit_logs (
  id bigint generated by default as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- ---------- Anonymous product analytics ----------
create table if not exists public.analytics_events (
  id bigint generated by default as identity primary key,
  event_type text not null check (event_type in ('mood_select','search','save_story','unsave_story','story_view','cta_click','reaction','newsletter_subscribe','for_you_view','page_view')),
  event_value text,
  anonymous_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_type_created_idx on public.analytics_events(event_type,created_at desc);
create index if not exists analytics_events_anonymous_created_idx on public.analytics_events(anonymous_id,created_at desc);

-- ---------- User creation ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,email,display_name,role,active)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'display_name',''),'member',true)
  on conflict(id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path=public as $$
  select role from public.profiles where id=auth.uid() and active=true limit 1
$$;

create or replace function public.is_role(roles text[])
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_user_role()=any(roles),false)
$$;

-- ---------- Revision / audit trigger helpers ----------
create or replace function public.capture_revision()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op='UPDATE' then
    insert into public.content_revisions(entity_type,entity_id,snapshot,changed_by)
    values(tg_table_name,old.id,to_jsonb(old),auth.uid());
  end if;
  return new;
end;$$;

create or replace function public.capture_audit()
returns trigger language plpgsql security definer set search_path=public as $$
declare target text;
begin
  if tg_op='DELETE' then target := old.id::text; else target := new.id::text; end if;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,details)
  values(auth.uid(),lower(tg_op),tg_table_name,target,jsonb_build_object('source','database'));
  if tg_op='DELETE' then return old; else return new; end if;
end;$$;

-- Revision triggers

drop trigger if exists posts_revision on public.posts;
create trigger posts_revision before update on public.posts for each row execute function public.capture_revision();
drop trigger if exists pages_revision on public.pages;
create trigger pages_revision before update on public.pages for each row execute function public.capture_revision();
drop trigger if exists letters_revision on public.letters;
create trigger letters_revision before update on public.letters for each row execute function public.capture_revision();
drop trigger if exists homepage_sections_revision on public.homepage_sections;
create trigger homepage_sections_revision before update on public.homepage_sections for each row execute function public.capture_revision();
drop trigger if exists homepage_items_revision on public.homepage_items;
create trigger homepage_items_revision before update on public.homepage_items for each row execute function public.capture_revision();

-- Audit triggers
drop trigger if exists posts_audit on public.posts;
create trigger posts_audit after insert or update or delete on public.posts for each row execute function public.capture_audit();
drop trigger if exists pages_audit on public.pages;
create trigger pages_audit after insert or update or delete on public.pages for each row execute function public.capture_audit();
drop trigger if exists letters_audit on public.letters;
create trigger letters_audit after insert or update or delete on public.letters for each row execute function public.capture_audit();
drop trigger if exists homepage_sections_audit on public.homepage_sections;
create trigger homepage_sections_audit after insert or update or delete on public.homepage_sections for each row execute function public.capture_audit();
drop trigger if exists homepage_items_audit on public.homepage_items;
create trigger homepage_items_audit after insert or update or delete on public.homepage_items for each row execute function public.capture_audit();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.pages enable row level security;
alter table public.letters enable row level security;
alter table public.community_notes enable row level security;
alter table public.story_submissions enable row level security;
alter table public.site_content enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.homepage_items enable row level security;
alter table public.media enable row level security;
alter table public.content_revisions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.analytics_events enable row level security;

-- Profiles
drop policy if exists "profiles_self_or_superadmin_read" on public.profiles;
create policy "profiles_self_or_superadmin_read" on public.profiles for select to authenticated
using (id=auth.uid() or public.is_role(array['super_admin','admin']));
drop policy if exists "superadmin_profiles_update" on public.profiles;
create policy "superadmin_profiles_update" on public.profiles for update to authenticated
using (public.is_role(array['super_admin'])) with check (public.is_role(array['super_admin']));

-- Posts: scheduled posts become public automatically when scheduled_at is reached.
drop policy if exists "public_read_visible_posts" on public.posts;
create policy "public_read_visible_posts" on public.posts for select to anon using (
  status='published' or (status='scheduled' and scheduled_at is not null and scheduled_at <= now())
);
drop policy if exists "staff_read_posts" on public.posts;
create policy "staff_read_posts" on public.posts for select to authenticated using (
  status='published' or (status='scheduled' and scheduled_at <= now()) or
  public.is_role(array['super_admin','admin','editor']) or
  (public.is_role(array['author']) and author_id=auth.uid())
);
drop policy if exists "staff_insert_posts" on public.posts;
create policy "staff_insert_posts" on public.posts for insert to authenticated with check (
  (public.is_role(array['super_admin','admin','editor']) and author_id=auth.uid()) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review'))
);
drop policy if exists "staff_update_posts" on public.posts;
create policy "staff_update_posts" on public.posts for update to authenticated using (
  public.is_role(array['super_admin','admin','editor']) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review'))
) with check (
  public.is_role(array['super_admin','admin','editor']) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review'))
);
drop policy if exists "admins_delete_posts" on public.posts;
create policy "admins_delete_posts" on public.posts for delete to authenticated
using (public.is_role(array['super_admin','admin']));

-- Pages
drop policy if exists "public_read_pages" on public.pages;
create policy "public_read_pages" on public.pages for select to anon using (status='published');
drop policy if exists "staff_read_pages" on public.pages;
create policy "staff_read_pages" on public.pages for select to authenticated using (status='published' or public.is_role(array['super_admin','admin','editor']));
drop policy if exists "editors_insert_pages" on public.pages;
create policy "editors_insert_pages" on public.pages for insert to authenticated with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "editors_update_pages" on public.pages;
create policy "editors_update_pages" on public.pages for update to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "admins_delete_pages" on public.pages;
create policy "admins_delete_pages" on public.pages for delete to authenticated using (public.is_role(array['super_admin','admin']));

-- Letters
drop policy if exists "public_read_letters" on public.letters;
create policy "public_read_letters" on public.letters for select to anon using (status='published');
drop policy if exists "staff_read_letters" on public.letters;
create policy "staff_read_letters" on public.letters for select to authenticated using (status='published' or public.is_role(array['super_admin','admin','editor']));
drop policy if exists "editors_insert_letters" on public.letters;
create policy "editors_insert_letters" on public.letters for insert to authenticated with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "editors_update_letters" on public.letters;
create policy "editors_update_letters" on public.letters for update to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "admins_delete_letters" on public.letters;
create policy "admins_delete_letters" on public.letters for delete to authenticated using (public.is_role(array['super_admin','admin']));

-- Community notes
drop policy if exists "public_submit_notes" on public.community_notes;
create policy "public_submit_notes" on public.community_notes for insert to anon,authenticated
with check (status='pending' and approved_by is null);
drop policy if exists "public_read_approved_notes" on public.community_notes;
create policy "public_read_approved_notes" on public.community_notes for select to anon using (status='approved');
drop policy if exists "moderators_read_notes" on public.community_notes;
create policy "moderators_read_notes" on public.community_notes for select to authenticated using (public.is_role(array['super_admin','admin','editor','moderator']));
drop policy if exists "moderators_update_notes" on public.community_notes;
create policy "moderators_update_notes" on public.community_notes for update to authenticated using (public.is_role(array['super_admin','admin','editor','moderator'])) with check (public.is_role(array['super_admin','admin','editor','moderator']));

-- Story submissions
drop policy if exists "public_submit_stories" on public.story_submissions;
create policy "public_submit_stories" on public.story_submissions for insert to anon,authenticated with check (status='pending');
drop policy if exists "moderators_read_submissions" on public.story_submissions;
create policy "moderators_read_submissions" on public.story_submissions for select to authenticated using (public.is_role(array['super_admin','admin','editor','moderator']));
drop policy if exists "moderators_update_submissions" on public.story_submissions;
create policy "moderators_update_submissions" on public.story_submissions for update to authenticated using (public.is_role(array['super_admin','admin','editor','moderator'])) with check (public.is_role(array['super_admin','admin','editor','moderator']));

-- Homepage / site content
drop policy if exists "public_read_site_content" on public.site_content;
create policy "public_read_site_content" on public.site_content for select to anon using (true);
drop policy if exists "staff_site_content_all" on public.site_content;
create policy "staff_site_content_all" on public.site_content for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "public_home_sections" on public.homepage_sections;
create policy "public_home_sections" on public.homepage_sections for select to anon using (enabled=true);
drop policy if exists "staff_home_sections_all" on public.homepage_sections;
create policy "staff_home_sections_all" on public.homepage_sections for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "public_home_items" on public.homepage_items;
create policy "public_home_items" on public.homepage_items for select to anon using (enabled=true);
drop policy if exists "staff_home_items_all" on public.homepage_items;
create policy "staff_home_items_all" on public.homepage_items for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));

-- Media metadata
drop policy if exists "staff_media_read" on public.media;
create policy "staff_media_read" on public.media for select to authenticated using (public.is_role(array['super_admin','admin','editor','author']));
drop policy if exists "staff_media_insert" on public.media;
create policy "staff_media_insert" on public.media for insert to authenticated with check (public.is_role(array['super_admin','admin','editor','author']) and uploaded_by=auth.uid());
drop policy if exists "staff_media_update" on public.media;
create policy "staff_media_update" on public.media for update to authenticated using (public.is_role(array['super_admin','admin','editor']) or uploaded_by=auth.uid()) with check (public.is_role(array['super_admin','admin','editor']) or uploaded_by=auth.uid());
drop policy if exists "admins_media_delete" on public.media;
create policy "admins_media_delete" on public.media for delete to authenticated using (public.is_role(array['super_admin','admin']));

-- Revisions / audit
drop policy if exists "staff_revisions_read" on public.content_revisions;
create policy "staff_revisions_read" on public.content_revisions for select to authenticated using (public.is_role(array['super_admin','admin','editor']) or changed_by=auth.uid());
drop policy if exists "admins_audit_read" on public.audit_logs;
create policy "admins_audit_read" on public.audit_logs for select to authenticated using (public.is_role(array['super_admin','admin']));

-- Analytics: public can only insert, never read.
drop policy if exists "public_insert_analytics" on public.analytics_events;
create policy "public_insert_analytics" on public.analytics_events for insert to anon,authenticated with check (true);
drop policy if exists "admins_read_analytics" on public.analytics_events;
create policy "admins_read_analytics" on public.analytics_events for select to authenticated using (public.is_role(array['super_admin','admin','editor','seo_manager']));

-- Storage
insert into storage.buckets(id,name,public) values('media','media',true)
on conflict(id) do update set public=true;
drop policy if exists "public_media_read" on storage.objects;
create policy "public_media_read" on storage.objects for select to public using (bucket_id='media');
drop policy if exists "staff_media_upload" on storage.objects;
create policy "staff_media_upload" on storage.objects for insert to authenticated with check (bucket_id='media' and public.is_role(array['super_admin','admin','editor','author']));
drop policy if exists "staff_media_update_storage" on storage.objects;
create policy "staff_media_update_storage" on storage.objects for update to authenticated using (bucket_id='media' and public.is_role(array['super_admin','admin','editor','author']));
drop policy if exists "admins_media_delete_storage" on storage.objects;
create policy "admins_media_delete_storage" on storage.objects for delete to authenticated using (bucket_id='media' and public.is_role(array['super_admin','admin']));

-- ---------- Starter content ----------
insert into public.pages(title,slug,symbol,headline,intro,quote,prompts,status) values
('Healing','healing','♡','You do not have to heal all at once.','Healing is not a race back to who you were. It is the slow work of becoming someone who can carry the past without living inside it.','A difficult day does not erase your progress.','["Missing them is not the same as needing them back.","You are allowed to have tender days.","Small peaceful decisions still count as healing."]','published'),
('Relationships','relationships','∞','Some relationships change us even after they end.','Love, attachment, distance, boundaries and endings can leave questions that take time to understand.','Not every relationship is meant to last forever to have mattered deeply.','["Notice what you keep excusing.","Love should not require self-abandonment.","Boundaries can be an act of love too."]','published'),
('Self-Worth','self-worth','◇','Your worth was never waiting for someone else to confirm it.','Rejection, distance, silence and endings can make you question yourself.','Someone not choosing you did not make you less worthy of being chosen.','["You do not need to earn basic care.","Comparison is not clarity.","Your value survives someone else''s absence."]','published'),
('Midnight Thoughts','midnight-thoughts','…','Not every thought needs an answer tonight.','The mind often searches for certainty when the heart feels unsafe.','Some thoughts can wait until morning. Rest is not avoidance.','["Name what is actually true.","Do not mistake anxiety for intuition.","Give tomorrow a chance to answer."]','published'),
('Letting Go','letting-go','↘','Missing them does not mean you should return.','Sometimes what you miss is not the relationship itself, but the familiarity, the memories, or the version of you that still believed everything would work out.','You can remember something with love and still know that returning would cost your peace.','["Nostalgia rarely remembers the full story.","Missing is not the same as belonging.","You can close a door without hating what was behind it."]','published'),
('Starting Again','starting-again','↻','Starting over is not starting from nothing.','You are entering the next chapter with lessons, boundaries, memories, clearer instincts and a deeper understanding of what you need.','The next chapter does not need to look like the last one to be meaningful.','["Take what you learned with you.","New does not mean empty.","You are allowed to begin differently."]','published')
on conflict(slug) do nothing;

insert into public.homepage_sections(slug,title,eyebrow,intro,enabled,sort_order,settings) values
('hero','Mood Hero','HOW DOES YOUR HEART FEEL TODAY?',null,true,10,'{}'),
('read_this_when','Read This When','FOR WHEREVER YOUR HEART IS TODAY','Choose a path based on what you are feeling.',true,20,'{"heading":"Read This When..."}'),
('tap_reveal','Tap To Reveal','PAUSE HERE','Tap a card to reveal the words waiting underneath.',true,30,'{"heading":"Which thought has been following you lately?"}'),
('give_words','Give Me Words','NEED SOMETHING TO HOLD ONTO?',null,true,40,'{"heading":"Give me words."}'),
('letters','Letters Never Sent','LETTERS NEVER SENT','Private words that were folded in thought, carried for too long, and never delivered.',true,50,'{"heading":"Some things are easier to write than to say."}'),
('community','Community CTA','UNTENANTED HEART COMMUNITY','Read community reflections, or leave a short note that another heart may need to find.',true,60,'{"heading":"Some stories become lighter when they are finally spoken."}'),
('latest','Latest Stories','FROM THE HEART','Quiet stories, honest reflections, and words for feelings that are difficult to explain.',true,70,'{"heading":"Latest stories & reflections"}'),
('submit_story','Submit Story CTA','YOUR STORY','If you have lived through something that changed you, your experience may become the words another person has been searching for.',true,80,'{"heading":"Some stories become lighter when they are finally spoken."}')
on conflict(slug) do nothing;

insert into public.homepage_items(section_slug,item_type,label,title,body,link_label,link_url,accent,sort_order) values
('hero','mood','Healing','You do not have to heal all at once.','Some healing happens quietly — in the boundaries you finally keep, the messages you no longer send, and the peace you begin choosing.','Read what your heart needs →','/healing','#f1dfe0',10),
('hero','mood','Missing Someone','Missing them does not mean you should return.','You can remember what was beautiful without forgetting what made you leave.','Read about letting go →','/letting-go','#eadde8',20),
('hero','mood','Overthinking','Not every thought needs an answer tonight.','Some questions become clearer after rest, not after another hour of thinking.','Read midnight thoughts →','/midnight-thoughts','#dde5eb',30),
('hero','mood','Lonely','Being alone does not mean you are unwanted.','Loneliness is a feeling — not a measurement of your worth.','Read for your self-worth →','/self-worth','#e8dfd6',40),
('hero','mood','Starting Again','Starting over is not starting from nothing.','You are entering the next chapter with lessons, boundaries and clearer instincts.','Read about starting again →','/starting-again','#dfe8dc',50),
('read_this_when','card','01','You miss someone you know you should not return to.','For the nights when nostalgia begins rewriting the truth.','Letting Go →','/letting-go',null,10),
('read_this_when','card','02','You are wondering whether you were ever enough.','A reminder that another person does not get to define your value.','Self-Worth →','/self-worth',null,20),
('read_this_when','card','03','You are trying to understand a relationship that changed you.','Reflections on connection, distance, attachment and boundaries.','Relationships →','/relationships',null,30),
('read_this_when','card','04','Your mind feels louder when everything else gets quiet.','Short thoughts for overthinking, late nights and unfinished feelings.','Midnight Thoughts →','/midnight-thoughts',null,40),
('tap_reveal','reveal','01','What if I never completely get over them?','You do not have to erase someone to move forward without them. Healing is not forgetting.',null,null,null,10),
('tap_reveal','reveal','02','Why was I never enough?','Someone''s inability to love you properly was never evidence that you were difficult to love.',null,null,null,20),
('tap_reveal','reveal','03','Why does my mind keep returning to it?','Your mind may still be trying to understand something your heart never received closure for.',null,null,null,30),
('give_words','prompt',null,null,'Maybe today is not about fixing everything. Maybe it is simply about making it through gently.',null,null,null,10),
('give_words','prompt',null,null,'You are allowed to miss what mattered without reopening what hurt you.',null,null,null,20),
('give_words','prompt',null,null,'A difficult day does not erase the quiet progress you have already made.',null,null,null,30),
('give_words','prompt',null,null,'You do not need every answer before you are allowed to choose peace.',null,null,null,40),
('hero','ticker',null,null,'Healing takes its own time',null,null,null,110),
('hero','ticker',null,null,'You are allowed to choose yourself',null,null,null,120),
('hero','ticker',null,null,'Some endings are beginnings in disguise',null,null,null,130),
('hero','ticker',null,null,'Your feelings deserve space',null,null,null,140)
on conflict do nothing;

insert into public.letters(recipient,salutation,body,closing,signature,ps,status,sort_order) values
('To you — the person I left while I still loved you.','Dear you,','I thought leaving would mean I stopped loving you.\n\nInstead, I learned that love and leaving can exist in the same heart. I walked away because I was slowly disappearing while trying to keep us together.','Still wishing you well,','Someone who finally chose themselves.','Loving you was real. Leaving was real too.','published',1)
on conflict do nothing;


-- =========================================================
-- MEMBERS / PERSONALIZATION / PAGE BUILDER / NEWSLETTER
-- =========================================================

-- Editorial ownership and workflow metadata is defined directly on public.posts above.

-- Member preference and cross-device saves
create table if not exists public.member_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  interests text[] not null default '{}',
  preferred_mood text,
  newsletter_digest boolean not null default true,
  updated_at timestamptz not null default now()
);
create table if not exists public.member_saved_posts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,post_id)
);

-- Member reactions + safety reports
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','community_note')),
  target_id uuid not null,
  reaction_type text not null check (reaction_type in ('needed','felt','love')),
  created_at timestamptz not null default now(),
  unique(user_id,target_type,target_id,reaction_type)
);
create index if not exists reactions_target_idx on public.reactions(target_type,target_id);

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id text not null,
  reason text not null,
  details text default '',
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  moderator_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Internal editorial collaboration
create table if not exists public.editorial_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists editorial_comments_post_idx on public.editorial_comments(post_id,created_at);

-- Newsletter centre
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  interest text not null default 'all',
  status text not null default 'pending' check (status in ('pending','active','unsubscribed','bounced')),
  confirm_token text unique,
  unsubscribe_token text unique default encode(gen_random_bytes(24),'hex'),
  confirmed_at timestamptz,
  source text default '',
  medium text default '',
  campaign text default '',
  referrer text default '',
  landing_page text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preheader text default '',
  intro text default '',
  segment text not null default 'all',
  status text not null default 'draft' check (status in ('draft','ready','archived')),
  scheduled_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reusable full page builder
create table if not exists public.custom_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  blocks jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  focus_keyword text,
  breadcrumb_title text,
  og_title text,
  og_description text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  schema_type text not null default 'WebPage',
  faq_items jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Navigation and safe global theme controls
create table if not exists public.site_navigation (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  enabled boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Collections / reading series
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  focus_keyword text,
  breadcrumb_title text,
  og_title text,
  og_description text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  schema_type text not null default 'CollectionPage',
  deleted_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.collection_posts (
  collection_id uuid not null references public.collections(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  sort_order int not null default 0,
  primary key(collection_id,post_id)
);

-- Daily reflection publishing
create table if not exists public.daily_reflections (
  id uuid primary key default gen_random_uuid(),
  publish_date date not null unique,
  title text not null,
  body text not null,
  emotion text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe member profile update: never exposes role/active changes to the member.
create or replace function public.update_my_member_profile(p_display_name text,p_bio text)
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.profiles set display_name=left(coalesce(p_display_name,''),80),bio=left(coalesce(p_bio,''),300),updated_at=now() where id=auth.uid();
end;$$;
grant execute on function public.update_my_member_profile(text,text) to authenticated;

-- RLS FOR MEMBER / PUBLISHING MODULES
alter table public.member_preferences enable row level security;
alter table public.member_saved_posts enable row level security;
alter table public.reactions enable row level security;
alter table public.content_reports enable row level security;
alter table public.editorial_comments enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_issues enable row level security;
alter table public.custom_pages enable row level security;
alter table public.site_navigation enable row level security;
alter table public.site_settings enable row level security;
alter table public.collections enable row level security;
alter table public.collection_posts enable row level security;
alter table public.daily_reflections enable row level security;

-- Members can only see/change their own preferences and saves.
drop policy if exists "member_preferences_self" on public.member_preferences;
create policy "member_preferences_self" on public.member_preferences for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "member_saved_self" on public.member_saved_posts;
create policy "member_saved_self" on public.member_saved_posts for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Reactions: self-service via authenticated API/client. Public counts are returned by server route.
drop policy if exists "reactions_self_read" on public.reactions;
create policy "reactions_self_read" on public.reactions for select to authenticated using (user_id=auth.uid());
drop policy if exists "reactions_self_insert" on public.reactions;
create policy "reactions_self_insert" on public.reactions for insert to authenticated with check (user_id=auth.uid());
drop policy if exists "reactions_self_delete" on public.reactions;
create policy "reactions_self_delete" on public.reactions for delete to authenticated using (user_id=auth.uid());

-- Reports are private to moderators/admins after submission through protected API.
drop policy if exists "moderators_read_reports" on public.content_reports;
create policy "moderators_read_reports" on public.content_reports for select to authenticated using (public.is_role(array['super_admin','admin','editor','moderator']));
drop policy if exists "moderators_update_reports" on public.content_reports;
create policy "moderators_update_reports" on public.content_reports for update to authenticated using (public.is_role(array['super_admin','admin','editor','moderator'])) with check (public.is_role(array['super_admin','admin','editor','moderator']));

-- Editorial comments are staff-only; authors can participate on posts they can read.
drop policy if exists "staff_read_editorial_comments" on public.editorial_comments;
create policy "staff_read_editorial_comments" on public.editorial_comments for select to authenticated using (public.is_role(array['super_admin','admin','editor']) or user_id=auth.uid() or exists(select 1 from public.posts p where p.id=post_id and p.author_id=auth.uid()));
drop policy if exists "staff_add_editorial_comments" on public.editorial_comments;
create policy "staff_add_editorial_comments" on public.editorial_comments for insert to authenticated with check (user_id=auth.uid() and public.is_role(array['super_admin','admin','editor','author']));

-- Newsletter data is editorial-only. Public subscription goes through server API.
drop policy if exists "staff_read_newsletter_subscribers" on public.newsletter_subscribers;
create policy "staff_read_newsletter_subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "staff_newsletter_issues" on public.newsletter_issues;
create policy "staff_newsletter_issues" on public.newsletter_issues for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));

-- Public pages + staff editing
drop policy if exists "public_custom_pages" on public.custom_pages;
create policy "public_custom_pages" on public.custom_pages for select to anon,authenticated using (status='published');
drop policy if exists "staff_custom_pages" on public.custom_pages;
create policy "staff_custom_pages" on public.custom_pages for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));

-- Navigation / global settings are publicly readable and editorially managed.
drop policy if exists "public_site_navigation" on public.site_navigation;
create policy "public_site_navigation" on public.site_navigation for select to anon,authenticated using (enabled=true or public.is_role(array['super_admin','admin','editor']));
drop policy if exists "staff_site_navigation" on public.site_navigation;
create policy "staff_site_navigation" on public.site_navigation for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "public_site_settings" on public.site_settings;
create policy "public_site_settings" on public.site_settings for select to anon,authenticated using (true);
drop policy if exists "staff_site_settings" on public.site_settings;
create policy "staff_site_settings" on public.site_settings for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));

-- Collections and daily reflections.
drop policy if exists "public_collections" on public.collections;
create policy "public_collections" on public.collections for select to anon,authenticated using (status='published' or public.is_role(array['super_admin','admin','editor']));
drop policy if exists "staff_collections" on public.collections;
create policy "staff_collections" on public.collections for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "public_collection_posts" on public.collection_posts;
create policy "public_collection_posts" on public.collection_posts for select to anon,authenticated using (true);
drop policy if exists "staff_collection_posts" on public.collection_posts;
create policy "staff_collection_posts" on public.collection_posts for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));
drop policy if exists "public_daily_reflections" on public.daily_reflections;
create policy "public_daily_reflections" on public.daily_reflections for select to anon,authenticated using (status='published');
drop policy if exists "staff_daily_reflections" on public.daily_reflections;
create policy "staff_daily_reflections" on public.daily_reflections for all to authenticated using (public.is_role(array['super_admin','admin','editor'])) with check (public.is_role(array['super_admin','admin','editor']));

-- Seed public navigation + theme controls.
insert into public.site_navigation(label,url,enabled,sort_order)
select * from (values
('Home','/',true,10),('Healing','/healing',true,20),('Relationships','/relationships',true,30),('Self-Worth','/self-worth',true,40),('Midnight Thoughts','/midnight-thoughts',true,50),('Letters','/letters',true,60),('Community','/community',true,70),('Stories','/stories',true,80)
) v(label,url,enabled,sort_order)
where not exists(select 1 from public.site_navigation);

insert into public.site_settings(key,value) values
('accent','{"value":"#743d45"}'),('background','{"value":"#f8f4ef"}'),('paper','{"value":"#fffdf9"}'),('tagline','{"value":"Words for feelings you could not name."}'),('instagram','{"value":"https://www.instagram.com/untenanted_heart/"}')
on conflict(key) do nothing;


-- ---------- Policy hardening / collaboration triggers ----------
drop policy if exists "profiles_self_or_superadmin_read" on public.profiles;
drop policy if exists "profiles_self_or_staff_read" on public.profiles;
create policy "profiles_self_or_staff_read" on public.profiles for select to authenticated using (
  id=auth.uid() or public.is_role(array['super_admin']) or
  (role <> 'member' and public.is_role(array['admin','editor','moderator','author']))
);

-- Authors remain unable to push their content into public workflow stages.
drop policy if exists "staff_insert_posts" on public.posts;
create policy "staff_insert_posts" on public.posts for insert to authenticated with check (
  (public.is_role(array['super_admin','admin','editor']) and author_id=auth.uid()) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review') and workflow_stage in ('idea','assigned','draft','editorial_review'))
);
drop policy if exists "staff_update_posts" on public.posts;
create policy "staff_update_posts" on public.posts for update to authenticated using (
  public.is_role(array['super_admin','admin','editor']) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review'))
) with check (
  public.is_role(array['super_admin','admin','editor']) or
  (public.is_role(array['author']) and author_id=auth.uid() and status in ('draft','review') and workflow_stage in ('idea','assigned','draft','editorial_review'))
);

-- Revisions/audit for page-builder content.
drop trigger if exists custom_pages_revision on public.custom_pages;
create trigger custom_pages_revision before update on public.custom_pages for each row execute function public.capture_revision();
drop trigger if exists custom_pages_audit on public.custom_pages;
create trigger custom_pages_audit after insert or update or delete on public.custom_pages for each row execute function public.capture_audit();
drop trigger if exists collections_audit on public.collections;
create trigger collections_audit after insert or update or delete on public.collections for each row execute function public.capture_audit();

-- Refresh supported analytics event types.
alter table public.analytics_events drop constraint if exists analytics_events_event_type_check;
alter table public.analytics_events add constraint analytics_events_event_type_check check (event_type in ('mood_select','search','save_story','unsave_story','story_view','cta_click','reaction','newsletter_subscribe','for_you_view','page_view'));
-- =========================================================
-- SEO / TAXONOMY / REDIRECT MODULES
-- =========================================================


-- ---------- Post SEO + trash ----------
create index if not exists posts_tags_gin on public.posts using gin(tags);
create index if not exists posts_deleted_at_idx on public.posts(deleted_at);

-- ---------- Topic page SEO ----------

-- ---------- Custom page SEO ----------

-- ---------- Collection SEO ----------

-- ---------- Redirect manager ----------
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_url text not null,
  status_code int not null default 301 check (status_code in (301,302,307,308)),
  enabled boolean not null default true,
  hits bigint not null default 0,
  last_hit_at timestamptz,
  note text default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists redirects_enabled_source_idx on public.redirects(enabled,source_path);

-- Preserve SEO equity when editors change a public slug.
create or replace function public.capture_slug_redirect()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  old_path text;
  new_path text;
begin
  if old.slug is not distinct from new.slug then return new; end if;
  if tg_table_name='posts' then
    old_path:='/stories/'||old.slug; new_path:='/stories/'||new.slug;
  elsif tg_table_name='collections' then
    old_path:='/collections/'||old.slug; new_path:='/collections/'||new.slug;
  elsif tg_table_name='custom_pages' then
    old_path:='/'||old.slug; new_path:='/'||new.slug;
  elsif tg_table_name='pages' then
    old_path:='/'||old.slug; new_path:='/'||new.slug;
  else
    return new;
  end if;
  insert into public.redirects(source_path,target_url,status_code,enabled,note,updated_at)
  values(old_path,new_path,301,true,'Automatic redirect created after slug change',now())
  on conflict(source_path) do update
    set target_url=excluded.target_url,status_code=301,enabled=true,note=excluded.note,updated_at=now();
  return new;
end;$$;

drop trigger if exists posts_slug_redirect on public.posts;
create trigger posts_slug_redirect after update of slug on public.posts for each row execute function public.capture_slug_redirect();
drop trigger if exists pages_slug_redirect on public.pages;
create trigger pages_slug_redirect after update of slug on public.pages for each row execute function public.capture_slug_redirect();
drop trigger if exists custom_pages_slug_redirect on public.custom_pages;
create trigger custom_pages_slug_redirect after update of slug on public.custom_pages for each row execute function public.capture_slug_redirect();
drop trigger if exists collections_slug_redirect on public.collections;
create trigger collections_slug_redirect after update of slug on public.collections for each row execute function public.capture_slug_redirect();

-- ---------- Taxonomy + indexable emotion landing pages ----------
create table if not exists public.taxonomies (
  id uuid primary key default gen_random_uuid(),
  taxonomy_type text not null check (taxonomy_type in ('category','emotion','tag')),
  label text not null,
  slug text not null,
  description text default '',
  seo_title text,
  seo_description text,
  og_image text,
  indexable boolean not null default false,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(taxonomy_type,slug)
);
create index if not exists taxonomies_public_idx on public.taxonomies(taxonomy_type,enabled,indexable,sort_order);

-- ---------- Redirect hit counter ----------
create or replace function public.record_redirect_hit(p_source text)
returns void
language sql
security definer
set search_path=public
as $$
  update public.redirects
  set hits=hits+1,last_hit_at=now()
  where enabled=true and source_path=p_source;
$$;
grant execute on function public.record_redirect_hit(text) to anon,authenticated;

-- ---------- Restricted SEO update RPCs ----------
create or replace function public.update_post_seo(p_post_id uuid,p_data jsonb)
returns void
language plpgsql
security definer
set search_path=public
as $$
declare r text;
begin
  r:=public.current_user_role();
  if r not in ('super_admin','admin','editor','seo_manager') then raise exception 'permission denied'; end if;
  update public.posts set
    seo_title=nullif(p_data->>'seo_title',''),
    seo_description=nullif(p_data->>'seo_description',''),
    focus_keyword=nullif(p_data->>'focus_keyword',''),
    secondary_keywords=coalesce(array(select jsonb_array_elements_text(coalesce(p_data->'secondary_keywords','[]'::jsonb))),'{}'),
    breadcrumb_title=nullif(p_data->>'breadcrumb_title',''),
    canonical_url=nullif(p_data->>'canonical_url',''),
    og_title=nullif(p_data->>'og_title',''),
    og_description=nullif(p_data->>'og_description',''),
    og_image=nullif(p_data->>'og_image',''),
    twitter_title=nullif(p_data->>'twitter_title',''),
    twitter_description=nullif(p_data->>'twitter_description',''),
    twitter_image=nullif(p_data->>'twitter_image',''),
    noindex=coalesce((p_data->>'noindex')::boolean,false),
    nofollow=coalesce((p_data->>'nofollow')::boolean,false),
    schema_type=coalesce(nullif(p_data->>'schema_type',''),'BlogPosting'),
    faq_items=coalesce(p_data->'faq_items','[]'::jsonb),
    updated_by=auth.uid(),updated_at=now()
  where id=p_post_id;
end;$$;
grant execute on function public.update_post_seo(uuid,jsonb) to authenticated;

create or replace function public.update_entity_seo(p_entity text,p_id uuid,p_data jsonb)
returns void
language plpgsql
security definer
set search_path=public
as $$
declare r text;
begin
  r:=public.current_user_role();
  if r not in ('super_admin','admin','editor','seo_manager') then raise exception 'permission denied'; end if;
  if p_entity='pages' then
    update public.pages set
      seo_title=nullif(p_data->>'seo_title',''),seo_description=nullif(p_data->>'seo_description',''),
      focus_keyword=nullif(p_data->>'focus_keyword',''),breadcrumb_title=nullif(p_data->>'breadcrumb_title',''),
      canonical_url=nullif(p_data->>'canonical_url',''),og_title=nullif(p_data->>'og_title',''),og_description=nullif(p_data->>'og_description',''),
      og_image=nullif(p_data->>'og_image',''),twitter_title=nullif(p_data->>'twitter_title',''),twitter_description=nullif(p_data->>'twitter_description',''),
      twitter_image=nullif(p_data->>'twitter_image',''),noindex=coalesce((p_data->>'noindex')::boolean,false),nofollow=coalesce((p_data->>'nofollow')::boolean,false),
      schema_type=coalesce(nullif(p_data->>'schema_type',''),'CollectionPage'),faq_items=coalesce(p_data->'faq_items','[]'::jsonb),updated_at=now()
    where id=p_id;
  elsif p_entity='custom_pages' then
    update public.custom_pages set
      seo_title=nullif(p_data->>'seo_title',''),seo_description=nullif(p_data->>'seo_description',''),
      focus_keyword=nullif(p_data->>'focus_keyword',''),breadcrumb_title=nullif(p_data->>'breadcrumb_title',''),
      canonical_url=nullif(p_data->>'canonical_url',''),og_title=nullif(p_data->>'og_title',''),og_description=nullif(p_data->>'og_description',''),
      og_image=nullif(p_data->>'og_image',''),twitter_title=nullif(p_data->>'twitter_title',''),twitter_description=nullif(p_data->>'twitter_description',''),
      twitter_image=nullif(p_data->>'twitter_image',''),noindex=coalesce((p_data->>'noindex')::boolean,false),nofollow=coalesce((p_data->>'nofollow')::boolean,false),
      schema_type=coalesce(nullif(p_data->>'schema_type',''),'WebPage'),faq_items=coalesce(p_data->'faq_items','[]'::jsonb),updated_at=now()
    where id=p_id;
  elsif p_entity='collections' then
    update public.collections set
      seo_title=nullif(p_data->>'seo_title',''),seo_description=nullif(p_data->>'seo_description',''),
      focus_keyword=nullif(p_data->>'focus_keyword',''),breadcrumb_title=nullif(p_data->>'breadcrumb_title',''),
      canonical_url=nullif(p_data->>'canonical_url',''),og_title=nullif(p_data->>'og_title',''),og_description=nullif(p_data->>'og_description',''),
      og_image=nullif(p_data->>'og_image',''),twitter_title=nullif(p_data->>'twitter_title',''),twitter_description=nullif(p_data->>'twitter_description',''),
      twitter_image=nullif(p_data->>'twitter_image',''),noindex=coalesce((p_data->>'noindex')::boolean,false),nofollow=coalesce((p_data->>'nofollow')::boolean,false),
      schema_type=coalesce(nullif(p_data->>'schema_type',''),'CollectionPage'),updated_at=now()
    where id=p_id;
  else
    raise exception 'unsupported SEO entity';
  end if;
end;$$;
grant execute on function public.update_entity_seo(text,uuid,jsonb) to authenticated;

-- ---------- RLS ----------
alter table public.redirects enable row level security;
alter table public.taxonomies enable row level security;

drop policy if exists "public_enabled_redirects" on public.redirects;
create policy "public_enabled_redirects" on public.redirects for select to anon,authenticated using (enabled=true or public.is_role(array['super_admin','admin','editor','seo_manager']));
drop policy if exists "seo_staff_manage_redirects" on public.redirects;
create policy "seo_staff_manage_redirects" on public.redirects for all to authenticated using (public.is_role(array['super_admin','admin','editor','seo_manager'])) with check (public.is_role(array['super_admin','admin','editor','seo_manager']));

drop policy if exists "public_enabled_taxonomies" on public.taxonomies;
create policy "public_enabled_taxonomies" on public.taxonomies for select to anon,authenticated using (enabled=true or public.is_role(array['super_admin','admin','editor','seo_manager']));
drop policy if exists "seo_staff_manage_taxonomies" on public.taxonomies;
create policy "seo_staff_manage_taxonomies" on public.taxonomies for all to authenticated using (public.is_role(array['super_admin','admin','editor','seo_manager'])) with check (public.is_role(array['super_admin','admin','editor','seo_manager']));

-- SEO managers may read content for auditing, but edit SEO through restricted RPCs.
drop policy if exists "staff_read_posts" on public.posts;
create policy "staff_read_posts" on public.posts for select to authenticated using (
  (deleted_at is null and (status='published' or (status='scheduled' and scheduled_at is not null and scheduled_at<=now()))) or
  public.is_role(array['super_admin','admin','editor','seo_manager']) or
  (public.is_role(array['author']) and author_id=auth.uid())
);
drop policy if exists "public_read_visible_posts" on public.posts;
create policy "public_read_visible_posts" on public.posts for select to anon using (
  deleted_at is null and (status='published' or (status='scheduled' and scheduled_at is not null and scheduled_at<=now()))
);

drop policy if exists "staff_read_pages" on public.pages;
create policy "staff_read_pages" on public.pages for select to authenticated using ((deleted_at is null and status='published') or public.is_role(array['super_admin','admin','editor','seo_manager']));
drop policy if exists "public_read_pages" on public.pages;
create policy "public_read_pages" on public.pages for select to anon using (deleted_at is null and status='published');

drop policy if exists "public_custom_pages" on public.custom_pages;
create policy "public_custom_pages" on public.custom_pages for select to anon,authenticated using (deleted_at is null and status='published');
drop policy if exists "seo_manager_read_custom_pages" on public.custom_pages;
create policy "seo_manager_read_custom_pages" on public.custom_pages for select to authenticated using (public.is_role(array['seo_manager']));

drop policy if exists "public_collections" on public.collections;
create policy "public_collections" on public.collections for select to anon,authenticated using ((deleted_at is null and status='published') or public.is_role(array['super_admin','admin','editor','seo_manager']));
drop policy if exists "seo_manager_read_collections" on public.collections;
create policy "seo_manager_read_collections" on public.collections for select to authenticated using (public.is_role(array['seo_manager']));

-- Global SEO settings are updated through a restricted RPC; theme/navigation permissions remain unchanged.
create or replace function public.update_seo_settings(p_data jsonb)
returns void
language plpgsql
security definer
set search_path=public
as $$
declare r text; kv record;
begin
  r:=public.current_user_role();
  if r not in ('super_admin','admin','editor','seo_manager') then raise exception 'permission denied'; end if;
  for kv in select key,value from jsonb_each(p_data) loop
    if kv.key like 'seo_%' then
      insert into public.site_settings(key,value,updated_at) values(kv.key,kv.value,now())
      on conflict(key) do update set value=excluded.value,updated_at=now();
    end if;
  end loop;
end;$$;
grant execute on function public.update_seo_settings(jsonb) to authenticated;

-- Staff profile visibility includes SEO Manager.
drop policy if exists "profiles_self_or_staff_read" on public.profiles;
create policy "profiles_self_or_staff_read" on public.profiles for select to authenticated using (
  id=auth.uid() or public.is_role(array['super_admin']) or
  (role <> 'member' and public.is_role(array['admin','editor','seo_manager','moderator','author']))
);

-- ---------- Seed SEO settings ----------
insert into public.site_settings(key,value) values
('seo_site_name','{"value":"Untenanted Heart"}'),
('seo_default_title','{"value":"Untenanted Heart | Words for feelings you could not name"}'),
('seo_default_description','{"value":"Emotional reflections on healing, relationships, self-worth, letting go, overthinking and starting again."}'),
('seo_default_og_image','{"value":""}'),
('seo_organization_name','{"value":"Untenanted Heart"}'),
('seo_organization_logo','{"value":""}'),
('seo_google_verification','{"value":""}'),
('seo_bing_verification','{"value":""}'),
('seo_twitter_handle','{"value":""}'),
('seo_index_search','{"value":false}')
on conflict(key) do nothing;

-- ---------- Seed analytics / integrations settings ----------
insert into public.site_settings(key,value) values
('analytics_consent_required','{"value":true}'),
('analytics_ga4_measurement_id','{"value":""}'),
('analytics_ga4_property_id','{"value":""}'),
('analytics_gsc_property_url','{"value":""}')
on conflict(key) do nothing;

-- ---------- Seed taxonomies ----------
insert into public.taxonomies(taxonomy_type,label,slug,description,indexable,enabled,sort_order) values
('category','Healing','healing','Reflections for healing gently and rebuilding inner steadiness.',true,true,10),
('category','Letting Go','letting-go','Reflections about release, closure and choosing peace.',true,true,20),
('category','Relationships','relationships','Reflections on love, attachment, distance and boundaries.',true,true,30),
('category','Self-Worth','self-worth','Reflections on self-worth, enoughness and choosing yourself.',true,true,40),
('category','Midnight Thoughts','midnight-thoughts','Quiet reflections for overthinking and late-night thoughts.',true,true,50),
('category','Starting Again','starting-again','Reflections about beginning again after change.',true,true,60),
('emotion','Lonely','lonely','Words for moments that feel quiet, distant or alone.',false,true,10),
('emotion','Closure','closure','Reflections about closure and unfinished endings.',false,true,20),
('emotion','Heartbroken','heartbroken','Words for heartbreak and grief after a relationship changes.',false,true,30),
('emotion','Hopeful','hopeful','Reflections for rebuilding hope and beginning again.',false,true,40)
on conflict(taxonomy_type,slug) do nothing;
