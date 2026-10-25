alter table public.portfolio_profile
  add column if not exists legacy_avatar_url text,
  add column if not exists legacy_resume_url text;

insert into public.portfolio_profile (
  singleton,
  full_name,
  display_name,
  professional_title,
  hero_intro,
  biography,
  professional_summary,
  location,
  interests,
  career_goals,
  legacy_avatar_url,
  legacy_resume_url,
  is_published
)
values (
  true,
  'Jhunnel C. Carillo',
  'Jhunnel',
  'BSIT Student · OJT Candidate · Aspiring Developer',
  'I am learning to build software and web applications one step at a time. I practice basic coding with AI as a learning aid, and enjoy exploring website layouts and creative ideas as I grow my skills through projects and hands-on experience.',
  'I am an Information Technology student from Camarines Norte, Philippines, interested in making useful software for real-world needs. I enjoy learning by building projects and working alongside people who use technology every day.',
  'I am pursuing a Bachelor of Science in Information Technology at Our Lady of Lourdes College Foundation. I enjoy learning by building projects, exploring visual ideas, and supporting IT equipment, campus activities, and day-to-day operations.',
  'Daet, Camarines Norte, Philippines',
  array['Web development', 'Graphic design', 'IT support', 'Creative multimedia'],
  array['Gain practical OJT experience', 'Continue learning graphic design'],
  '/images/profile/about-portrait.jpg',
  '/Jhunnel-Carillo-Resume.pdf',
  true
)
on conflict (singleton) do nothing;

insert into public.projects (
  slug, name, category, status, short_description, full_description, problem,
  solution, role, technologies, features, lessons_learned, github_url,
  legacy_cover_url, legacy_gallery, is_featured, is_published, display_order
)
values
(
  'mendoza-store-system',
  'Mendoza''s Feeds and Rice Store POS & Inventory System',
  'Business Management System',
  'In Progress',
  'A tailored Point-of-Sale (POS) and inventory management application customized for wholesale and retail sales of rice and feeds at Mendoza''s Store in Pinagbirayan Malaki, Paracale.',
  'A custom-built business management system built for Mendoza''s Store in Paracale, Camarines Norte. It streamlines daily sales transactions, converts wholesale units (bags) into retail quantities (kilograms), tracks customer credit records, and alerts managers when stock levels run low.',
  'Manual ledger logging and paper receipts caused inventory discrepancies, delayed cashier transaction times, and made tracking customer debt difficult across high-volume wholesale and retail orders.',
  'Engineered a streamlined POS application focused strictly on rice and feeds categories, featuring rapid barcode/manual item lookup, dual pricing rules, real-time stock deductions, and digital ledger tracking.',
  'Full-Stack Developer (Database Schema Design, Backend PHP Logic, and UI/UX Layout)',
  array['PHP', 'PostgreSQL', 'MySQL', 'JavaScript', 'HTML5', 'Tailwind CSS'],
  array['Wholesale and retail unit conversions (bags to kilograms)', 'Automated stock level threshold warnings for rice varieties and feeds', 'Customer debt ledger logging and payment history tracking', 'Printable receipt formatting and end-of-day sales auditing'],
  array['Designing relational database schemas for complex product unit conversions', 'Structuring clean SQL queries for stock deduction and accurate financial reports', 'Building accessible user interfaces for non-technical retail operators'],
  'https://github.com/Jhanelx-zz/mendoza-store-pos',
  '/images/mendoza-store.png',
  '[{"url":"/images/mendoza-store.png","caption":"POS Cashier Terminal — Wholesale & Retail Checkout Interface"},{"url":"/images/mndoza-dashboard.png","caption":"Inventory Stock Levels & Rice/Feeds Category Management"},{"url":"/images/mendoza-credit.png","caption":"Customer Debt & Payment Record Ledger"},{"url":"/images/mendoza-reports.png","caption":"Daily Sales Summary & Transaction Logs"}]'::jsonb,
  true, true, 0
),
(
  'iskalawihao-portal',
  'iSKalawihao — Youth Council Budget Transparency Portal',
  'Web Application',
  'Completed',
  'A web-based budget tracking and document transparency system designed and developed for the Sangguniang Kabataan of Barangay Alawihao.',
  'A community transparency web platform enabling youth council officials to post public budget allocations, document project expenditures, and allow local youth constituents to review official financial disbursements.',
  'Lack of centralized digital platforms for barangay youth council records hindered public transparency, making document retrieval slow and inefficient.',
  'Built a secure web portal where administrators upload verified expense receipts and project documents while community members view interactive budget breakdown visualizers.',
  'Backend & Database Developer',
  array['PHP', 'MySQL', 'JavaScript', 'HTML5', 'Bootstrap'],
  array['Secure admin portal for document uploads and project budget entries', 'Public transparency overview dashboard with expense breakdowns', 'Categorized financial record filtering and PDF report access'],
  array['Implementing user authentication and session management in PHP', 'Managing secure file uploads and organizing relational database tables'],
  'https://github.com/Jhanelx-zz/iskalawihao-portal',
  '/images/iskalawihao.jpg',
  '[{"url":"/images/iskalawihao.jpg","caption":"Public Budget Transparency Overview & Disbursement Charts"},{"url":"/images/iskalawihao-admin.jpeg","caption":"Admin Panel for Project Expenses & Document File Uploads"},{"url":"/images/iskalawihao-reports.jpeg","caption":"Categorized Financial Report Archive & Public Downloads"}]'::jsonb,
  true, true, 1
),
(
  'daet-tourism-alert-system',
  'Daet Tourism Crisis Communication & Emergency Alert System',
  'Academic Capstone Concept',
  'Academic Concept',
  'A proposed crisis communication platform to disseminate urgent alerts and emergency updates to tourists and local municipal authorities.',
  'An academic capstone concept aimed at strengthening disaster and crisis communication within Daet, Camarines Norte. The system outlines automated emergency broadcasting, municipal admin dashboards, and tourist safety guide management.',
  'Tourists visiting local coastal and eco-tourism spots during unexpected weather conditions often lack immediate access to verified municipal advisories.',
  'Conceptualized a centralized admin dashboard for local government units to broadcast real-time safety alerts and maintain accessible emergency hotline directories.',
  'Lead Concept Developer & UI/UX Wireframer',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
  array['Real-time crisis advisory broadcasting dashboard', 'Tourist guide and safety resource directory', 'Emergency contact routing for municipal emergency responders'],
  array['Designing responsive layouts optimized for fast mobile viewing during emergencies', 'Structuring public safety communication workflows for local government units'],
  'https://github.com/Jhanelx-zz/daet-tourism-alert',
  '/images/daet-tourism.png',
  '[{"url":"/images/daet-tourism.png","caption":"Emergency Crisis Advisory Broadcasting Dashboard"},{"url":"/images/daet-map.png","caption":"Interactive Tourist Emergency Map & Spot Safety Advisories"},{"url":"/images/daet-guide.png","caption":"Mobile Tourist Safety Guidelines & Emergency Hotline Directory"}]'::jsonb,
  true, true, 2
)
on conflict (slug) do nothing;

insert into public.skills (
  seed_key, category, name, description, proficiency_label, display_order, is_published
)
values
  ('skill-programming-js-ts-php', 'Programming & Web Foundations', 'Basic programming with JavaScript, TypeScript, and PHP', 'I practice coding through coursework and personal projects, using AI as a learning aid when I need guidance.', 'Building confidence', 0, true),
  ('skill-programming-html-css', 'Programming & Web Foundations', 'HTML, CSS, and Tailwind CSS for page structure and styling', 'I practice coding through coursework and personal projects, using AI as a learning aid when I need guidance.', 'Building confidence', 1, true),
  ('skill-programming-react-next', 'Programming & Web Foundations', 'Exploring React and Next.js website layouts', 'I practice coding through coursework and personal projects, using AI as a learning aid when I need guidance.', 'Building confidence', 2, true),
  ('skill-programming-ai-assisted', 'Programming & Web Foundations', 'Learning by reviewing, testing, and improving code with AI assistance', 'I practice coding through coursework and personal projects, using AI as a learning aid when I need guidance.', 'Building confidence', 3, true),
  ('skill-data-sql', 'Databases & Data', 'Basic SQL and relational database concepts', 'Foundational experience working with data for academic and practical application projects.', 'Practicing fundamentals', 4, true),
  ('skill-data-mysql-postgresql', 'Databases & Data', 'Exposure to MySQL and PostgreSQL', 'Foundational experience working with data for academic and practical application projects.', 'Practicing fundamentals', 5, true),
  ('skill-data-organization', 'Databases & Data', 'Organizing application data and understanding table relationships', 'Foundational experience working with data for academic and practical application projects.', 'Practicing fundamentals', 6, true),
  ('skill-support-labs', 'IT Support & Campus Operations', 'Assisting with computer laboratory maintenance and troubleshooting', 'Hands-on experience developed through my Student Assistant role with the MISITS Department.', 'Practical experience', 7, true),
  ('skill-support-av', 'IT Support & Campus Operations', 'Helping set up audio-visual equipment and event livestreams', 'Hands-on experience developed through my Student Assistant role with the MISITS Department.', 'Practical experience', 8, true),
  ('skill-support-records', 'IT Support & Campus Operations', 'Supporting document processing and student data verification', 'Hands-on experience developed through my Student Assistant role with the MISITS Department.', 'Practical experience', 9, true),
  ('skill-support-operations', 'IT Support & Campus Operations', 'Learning through day-to-day technical support tasks', 'Hands-on experience developed through my Student Assistant role with the MISITS Department.', 'Practical experience', 10, true),
  ('skill-creative-layouts', 'Creative & UI Exploration', 'Exploring website layouts and different interface ideas', 'I enjoy trying visual ideas and multimedia work alongside my IT studies, and continue to build these skills through practice.', 'Exploring and creating', 11, true),
  ('skill-creative-graphic-design', 'Creative & UI Exploration', 'Basic graphic design and digital editing', 'I enjoy trying visual ideas and multimedia work alongside my IT studies, and continue to build these skills through practice.', 'Exploring and creating', 12, true),
  ('skill-creative-event-materials', 'Creative & UI Exploration', 'Creating event materials, certificates, and visual layouts', 'I enjoy trying visual ideas and multimedia work alongside my IT studies, and continue to build these skills through practice.', 'Exploring and creating', 13, true),
  ('skill-creative-multimedia', 'Creative & UI Exploration', 'Trying multimedia edits, audio, and visual transitions', 'I enjoy trying visual ideas and multimedia work alongside my IT studies, and continue to build these skills through practice.', 'Exploring and creating', 14, true)
on conflict (seed_key) do nothing;

insert into public.work_experience (
  seed_key, job_title, organization, employment_type, location, start_date, is_current,
  description, responsibilities, display_order, is_published
)
values
(
  'experience-misits-student-assistant',
  'Student Assistant',
  'MISITS Department · Our Lady of Lourdes College Foundation (OLLCF)',
  'Student role',
  'Daet, Camarines Norte',
  '2025-01-01',
  true,
  'Supporting campus IT, computer labs, college events, and day-to-day technical needs.',
  array['Maintaining and inspecting computer laboratory equipment and network connections for daily student use.', 'Setting up audio, visual, and livestream LED wall equipment for official college assemblies and events.', 'Assisting enrollment officers with document processing, student records verification, and database entries.', 'Providing hardware and software troubleshooting for campus faculty and students.'],
  0,
  true
),
(
  'experience-software-project-developer',
  'Custom Software & Web Application Developer',
  'Mendoza''s Store · Barangay Alawihao Youth Council',
  'Academic & freelance',
  '',
  null,
  false,
  'Developed academic and community software projects, including business systems and transparency tools.',
  array['Designed database schemas and built PHP/PostgreSQL backend logic for Mendoza''s Feeds and Rice Store POS system.', 'Built the iSKalawihao youth budget portal to upload financial documents and present transparent project funding charts.', 'Programmed Arduino microcontrollers with ultrasonic and flame sensors for automated hardware prototypes.'],
  1,
  true
)
on conflict (seed_key) do nothing;

insert into public.education (
  seed_key, institution, qualification, field_of_study, is_current, details,
  display_order, is_published
)
values (
  'education-ollcf-bsit',
  'Our Lady of Lourdes College Foundation',
  'Bachelor of Science in Information Technology',
  'Information Technology',
  true,
  'Studying in Daet, Camarines Norte.',
  0,
  true
)
on conflict (seed_key) do nothing;

insert into public.contact_settings (
  singleton, introduction, email, email_is_public, phone, phone_is_public
)
values (
  true,
  'I am actively preparing for On-the-Job Training (OJT) opportunities. If you have an open position or inquiries regarding my projects, skills, or background, feel free to reach out!',
  'jhannellacarillo.official@gmail.com',
  true,
  '',
  false
)
on conflict (singleton) do nothing;

insert into public.social_links (platform, label, url, is_enabled, display_order)
select 'GitHub', 'Jhanelx-zz (Jhunnel Carillo)', 'https://github.com/Jhanelx-zz', true, 0
where not exists (
  select 1 from public.social_links where url = 'https://github.com/Jhanelx-zz'
);

insert into public.social_links (platform, label, url, is_enabled, display_order)
select 'LinkedIn', 'Jhannella Carillo | LinkedIn', 'https://www.linkedin.com/in/jhannella-carillo-bba780405/', true, 1
where not exists (
  select 1 from public.social_links
  where url = 'https://www.linkedin.com/in/jhannella-carillo-bba780405/'
);
