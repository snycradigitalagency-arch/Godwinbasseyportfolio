insert into site_settings (hero_headline, hero_subheadline, availability_status, email, whatsapp, linkedin_url, github_url, location)
values (
  'Godwin Bassey',
  'Full Stack Developer, Graphic Designer, and AI Automation Specialist — building premium digital products and the brands that carry them.',
  true,
  'hello@godwinbassey.com',
  '234000000000',
  'https://linkedin.com/in/godwinbassey',
  'https://github.com/godwinbassey',
  'Lagos, Nigeria'
);

insert into achievements (title, value, suffix, is_featured, sort_order) values
  ('Projects completed', '25', '+', true, 1),
  ('Web applications shipped', '5', '+', true, 2),
  ('Client satisfaction', '100', '%', true, 3);

insert into services (title, description, price_note, sort_order) values
  ('Full Stack Development', 'End-to-end web applications built with modern, scalable architecture.', 'From $2,500', 1),
  ('Brand Identity', 'Naming, visual identity, and design systems for products and people.', 'From $1,200', 2),
  ('AI Automation', 'Workflow automation and AI-driven tooling for teams that want to move faster.', 'Custom quote', 3);

insert into skills (name, category, sort_order) values
  ('TypeScript', 'dev', 1),
  ('React', 'dev', 2),
  ('Next.js', 'dev', 3),
  ('Supabase', 'dev', 4),
  ('Figma', 'design', 5),
  ('Adobe Creative Suite', 'design', 6);

insert into experience (role_title, company_name, start_date, end_date, description, sort_order) values
  ('Full Stack Developer', 'Independent / Freelance', '2022-01-01', null, 'Building web applications and digital products for clients across industries.', 1);

insert into education (school, degree, field_of_study, start_date, end_date, description, sort_order) values
  ('University', 'B.Sc.', 'Computer Science', '2018-09-01', '2022-06-01', 'Foundational study in software engineering and systems design.', 1);

insert into testimonials (client_name, client_title, client_company, content, is_featured, sort_order) values
  ('Sarah Chen', 'Product Lead', 'Northwind Labs', 'Godwin delivered a product that felt considered down to the last pixel — and shipped it faster than we expected.', true, 1);

insert into projects (slug, title, summary, overview, challenge, solution, results, tech_tags, status, content_status, is_featured, sort_order, published_at)
values (
  'northwind-dashboard',
  'Northwind Analytics Dashboard',
  'A real-time analytics dashboard for a logistics platform.',
  'Northwind needed a way to surface shipment data to non-technical stakeholders in real time.',
  'Existing reporting was static, exported manually, and always a day behind.',
  'Built a real-time dashboard on Next.js and Supabase with role-based views for ops, finance, and leadership.',
  'Reporting latency dropped from 24 hours to real-time; adopted by three departments within a month.',
  array['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
  'live',
  'published',
  true,
  1,
  now()
);

insert into insight_categories (name, slug) values ('Development', 'development');

insert into insights (slug, title, excerpt, content, category_id, reading_time_minutes, content_status, published_at)
select
  'building-real-time-dashboards-with-supabase',
  'Building Real-Time Dashboards With Supabase',
  'Notes on using Postgres row-level security and realtime subscriptions to ship dashboards clients actually trust.',
  '[{"type":"paragraph","text":"Real-time data is only useful if the people looking at it trust it. Here is how row-level security and Supabase realtime subscriptions work together to make that trust possible."}]'::jsonb,
  id,
  6,
  'published',
  now()
from insight_categories where slug = 'development';
