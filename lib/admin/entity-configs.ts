export type FieldType = "text" | "textarea" | "number" | "date" | "boolean" | "tags";

export interface EntityField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Shown as a column in the list view */
  listColumn?: boolean;
}

export interface EntityConfig {
  /** URL segment, e.g. /admin/content/projects */
  slug: string;
  /** Actual Supabase table name — kept separate so slugs can stay stable
   *  even if a table is renamed (this is how "insights" survives even
   *  though the underlying table could change again later). */
  table: string;
  label: string;
  pluralLabel: string;
  titleField: string;
  fields: EntityField[];
  orderBy?: string;
}

/**
 * Every content type editable from the CMS is declared here once.
 * Adding a new module (e.g. "resources") means adding a config entry
 * — not a new set of route files — which is what keeps this scalable
 * as the addendum's modules grow.
 */
export const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  projects: {
    slug: "projects",
    table: "projects",
    label: "Project",
    pluralLabel: "Projects",
    titleField: "title",
    orderBy: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, listColumn: true },
      { key: "slug", label: "Slug", type: "text", required: true, listColumn: true },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "overview", label: "Overview", type: "textarea" },
      { key: "challenge", label: "Challenge", type: "textarea" },
      { key: "research", label: "Research", type: "textarea" },
      { key: "process", label: "Process", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      { key: "results", label: "Results", type: "textarea" },
      { key: "tech_tags", label: "Tech Tags", type: "tags" },
      { key: "live_url", label: "Live URL", type: "text" },
      { key: "github_url", label: "GitHub URL", type: "text" },
      { key: "is_featured", label: "Featured", type: "boolean", listColumn: true },
      { key: "content_status", label: "Status", type: "text", listColumn: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  insights: {
    slug: "insights",
    table: "insights",
    label: "Insight",
    pluralLabel: "Insights",
    titleField: "title",
    orderBy: "published_at",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, listColumn: true },
      { key: "slug", label: "Slug", type: "text", required: true, listColumn: true },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "reading_time_minutes", label: "Reading Time (min)", type: "number" },
      { key: "content_status", label: "Status", type: "text", listColumn: true },
    ],
  },
  services: {
    slug: "services",
    table: "services",
    label: "Service",
    pluralLabel: "Services",
    titleField: "title",
    orderBy: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, listColumn: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "price_note", label: "Price Note", type: "text", listColumn: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  skills: {
    slug: "skills",
    table: "skills",
    label: "Skill",
    pluralLabel: "Skills",
    titleField: "name",
    orderBy: "sort_order",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, listColumn: true },
      { key: "category", label: "Category", type: "text", required: true, listColumn: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  achievements: {
    slug: "achievements",
    table: "achievements",
    label: "Achievement",
    pluralLabel: "Achievements",
    titleField: "title",
    orderBy: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, listColumn: true },
      { key: "value", label: "Value", type: "text", required: true, listColumn: true },
      { key: "suffix", label: "Suffix", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "is_featured", label: "Featured", type: "boolean", listColumn: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  certifications: {
    slug: "certifications",
    table: "certifications",
    label: "Certification",
    pluralLabel: "Certifications",
    titleField: "title",
    orderBy: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, listColumn: true },
      { key: "issuer", label: "Issuer", type: "text", required: true, listColumn: true },
      { key: "issue_date", label: "Issue Date", type: "date" },
      { key: "expiry_date", label: "Expiry Date", type: "date" },
      { key: "credential_url", label: "Credential URL", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  experience: {
    slug: "experience",
    table: "experience",
    label: "Experience",
    pluralLabel: "Experience",
    titleField: "role_title",
    orderBy: "sort_order",
    fields: [
      { key: "role_title", label: "Role Title", type: "text", required: true, listColumn: true },
      { key: "company_name", label: "Company", type: "text", required: true, listColumn: true },
      { key: "start_date", label: "Start Date", type: "date", required: true },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  education: {
    slug: "education",
    table: "education",
    label: "Education",
    pluralLabel: "Education",
    titleField: "school",
    orderBy: "sort_order",
    fields: [
      { key: "school", label: "School", type: "text", required: true, listColumn: true },
      { key: "degree", label: "Degree", type: "text", listColumn: true },
      { key: "field_of_study", label: "Field of Study", type: "text" },
      { key: "start_date", label: "Start Date", type: "date", required: true },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  seo_meta: {
    slug: "seo_meta",
    table: "seo_meta",
    label: "SEO Override",
    pluralLabel: "SEO",
    titleField: "page_path",
    fields: [
      { key: "page_path", label: "Page Path (e.g. /projects)", type: "text", required: true, listColumn: true },
      { key: "meta_title", label: "Meta Title", type: "text", listColumn: true },
      { key: "meta_description", label: "Meta Description", type: "textarea" },
      { key: "canonical_url", label: "Canonical URL", type: "text" },
      { key: "no_index", label: "No Index", type: "boolean", listColumn: true },
    ],
  },
  testimonials: {
    slug: "testimonials",
    table: "testimonials",
    label: "Testimonial",
    pluralLabel: "Testimonials",
    titleField: "client_name",
    orderBy: "sort_order",
    fields: [
      { key: "client_name", label: "Client Name", type: "text", required: true, listColumn: true },
      { key: "client_title", label: "Client Title", type: "text" },
      { key: "client_company", label: "Client Company", type: "text", listColumn: true },
      { key: "content", label: "Testimonial", type: "textarea", required: true },
      { key: "is_featured", label: "Featured", type: "boolean", listColumn: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
};

export function getEntityConfig(slug: string): EntityConfig | undefined {
  return ENTITY_CONFIGS[slug];
}
