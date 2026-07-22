// Hand-authored to match supabase/migrations/*.sql.
// Once the Supabase project is linked locally, replace with:
//   supabase gen types typescript --project-id <id> > types/database.types.ts
//
// NOTE: every table needs Row + Insert + Update + Relationships, or the
// supabase-js generic client silently collapses ALL table Row types to
// `never` (not just the incomplete one) — this bit us on the first real
// Vercel build: adding Insert/Update alone didn't fix it, only adding
// `Relationships: []` to every table did. The error surfaces at the
// first `.select()` call the type-checker reaches (contact/page.tsx's
// site_settings usage, alphabetically/build-order first), which made it
// look like a site_settings-specific bug — it wasn't.

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";
export type ProjectStatus = "live" | "in_progress" | "archived";
export type SkillCategory = "dev" | "design" | "ai_automation" | "strategy" | "tool";

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          hero_headline: string | null;
          hero_subheadline: string | null;
          availability_status: boolean;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          location: string | null;
          resume_file_url: string | null;
          resume_download_count: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          storage_path: string;
          file_name: string;
          mime_type: string | null;
          alt_text: string | null;
          blurhash: string | null;
          dominant_color: string | null;
          width: number | null;
          height: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & {
          storage_path: string;
          file_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          overview: string | null;
          challenge: string | null;
          research: string | null;
          process: string | null;
          solution: string | null;
          results: string | null;
          tech_tags: string[];
          status: ProjectStatus;
          live_url: string | null;
          github_url: string | null;
          cover_image_id: string | null;
          is_featured: boolean;
          sort_order: number;
          content_status: ContentStatus;
          published_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      project_gallery: {
        Row: { id: string; project_id: string; media_id: string; caption: string | null; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["project_gallery"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["project_gallery"]["Row"]>;
        Relationships: [];
      };
      project_before_after: {
        Row: { id: string; project_id: string; before_media_id: string | null; after_media_id: string | null; label: string | null };
        Insert: Partial<Database["public"]["Tables"]["project_before_after"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["project_before_after"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_title: string | null;
          client_company: string | null;
          content: string;
          is_featured: boolean;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          role_title: string;
          company_name: string;
          start_date: string;
          end_date: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["experience"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["experience"]["Row"]>;
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          school: string;
          degree: string | null;
          field_of_study: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["education"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["education"]["Row"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          value: string;
          suffix: string | null;
          description: string | null;
          icon_key: string | null;
          is_featured: boolean;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string | null;
          expiry_date: string | null;
          credential_url: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["certifications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["certifications"]["Row"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          icon_key: string | null;
          price_note: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: SkillCategory;
          icon_key: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
        Relationships: [];
      };
      insights: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: unknown;
          cover_image_id: string | null;
          category_id: string | null;
          reading_time_minutes: number | null;
          content_status: ContentStatus;
          published_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["insights"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["insights"]["Row"]>;
        Relationships: [];
      };
      insight_categories: {
        Row: { id: string; name: string; slug: string };
        Insert: Partial<Database["public"]["Tables"]["insight_categories"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["insight_categories"]["Row"]>;
        Relationships: [];
      };
      tags: {
        Row: { id: string; name: string; slug: string };
        Insert: Partial<Database["public"]["Tables"]["tags"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["tags"]["Row"]>;
        Relationships: [];
      };
      insight_tags: {
        Row: { insight_id: string; tag_id: string };
        Insert: Partial<Database["public"]["Tables"]["insight_tags"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["insight_tags"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          body: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject?: string | null;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [];
      };
      seo_meta: {
        Row: {
          id: string;
          page_path: string;
          meta_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          no_index: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["seo_meta"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["seo_meta"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin" | "editor";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          body: string | null;
          priority: "low" | "normal" | "high";
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & { type: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      visitor_sessions: {
        Row: {
          id: string;
          first_seen: string;
          last_seen: string;
          browser: string | null;
          device: string | null;
          os: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
        };
        Insert: {
          browser?: string | null;
          device?: string | null;
          os?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["visitor_sessions"]["Row"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          session_id: string | null;
          event_type: string;
          target_type: string | null;
          target_id: string | null;
          page_path: string | null;
          created_at: string;
        };
        Insert: {
          session_id?: string | null;
          event_type: string;
          target_type?: string | null;
          target_id?: string | null;
          page_path?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      unified_timeline: {
        Row: {
          id: string;
          type: "experience" | "education";
          title: string | null;
          subtitle: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          sort_order: number;
        };
      };
    };
  };
}
