export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type Timestamped = {
  id: string;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      portfolio_admins: Table<
        { user_id: string; singleton: boolean; created_at: string },
        { user_id: string; singleton?: boolean; created_at?: string }
      >;
      media_assets: Table<
        Timestamped & {
          bucket_id: "portfolio-public" | "portfolio-private";
          object_path: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          is_public: boolean;
          alt_text: string | null;
        },
        {
          id?: string;
          bucket_id: "portfolio-public" | "portfolio-private";
          object_path: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          is_public?: boolean;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      portfolio_profile: Table<
        {
          singleton: boolean;
          full_name: string;
          display_name: string;
          professional_title: string;
          hero_intro: string;
          biography: string;
          professional_summary: string;
          location: string;
          interests: string[];
          career_goals: string[];
          avatar_media_id: string | null;
          resume_media_id: string | null;
          legacy_avatar_url: string | null;
          legacy_resume_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          singleton?: boolean;
          full_name: string;
          display_name: string;
          professional_title: string;
          hero_intro: string;
          biography: string;
          professional_summary: string;
          location: string;
          interests?: string[];
          career_goals?: string[];
          avatar_media_id?: string | null;
          resume_media_id?: string | null;
          legacy_avatar_url?: string | null;
          legacy_resume_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      skills: Table<
        Timestamped & {
          category: string;
          name: string;
          description: string;
          proficiency_label: string | null;
          display_order: number;
          is_published: boolean;
          seed_key: string | null;
        },
        {
          id?: string;
          category: string;
          name: string;
          description?: string;
          proficiency_label?: string | null;
          display_order?: number;
          is_published?: boolean;
          seed_key?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      projects: Table<
        Timestamped & {
          slug: string;
          name: string;
          category: string;
          status: string;
          short_description: string;
          full_description: string;
          problem: string;
          solution: string;
          role: string;
          technologies: string[];
          features: string[];
          lessons_learned: string[];
          project_date: string | null;
          github_url: string | null;
          demo_url: string | null;
          documentation_url: string | null;
          cover_media_id: string | null;
          legacy_cover_url: string | null;
          legacy_gallery: Json;
          is_featured: boolean;
          is_published: boolean;
          display_order: number;
        },
        {
          id?: string;
          slug: string;
          name: string;
          category: string;
          status: string;
          short_description: string;
          full_description: string;
          problem?: string;
          solution?: string;
          role?: string;
          technologies?: string[];
          features?: string[];
          lessons_learned?: string[];
          project_date?: string | null;
          github_url?: string | null;
          demo_url?: string | null;
          documentation_url?: string | null;
          cover_media_id?: string | null;
          legacy_cover_url?: string | null;
          legacy_gallery?: Json;
          is_featured?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      project_gallery: Table<
        Timestamped & {
          project_id: string;
          media_id: string | null;
          legacy_url: string | null;
          caption: string;
          display_order: number;
        },
        {
          id?: string;
          project_id: string;
          media_id?: string | null;
          legacy_url?: string | null;
          caption?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      achievements: Table<
        Timestamped & {
          kind: string;
          title: string;
          description: string;
          issuer: string;
          issued_on: string | null;
          expires_on: string | null;
          verification_url: string | null;
          certificate_media_id: string | null;
          is_published: boolean;
          display_order: number;
        },
        {
          id?: string;
          kind: string;
          title: string;
          description?: string;
          issuer?: string;
          issued_on?: string | null;
          expires_on?: string | null;
          verification_url?: string | null;
          certificate_media_id?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      work_experience: Table<
        Timestamped & {
          job_title: string;
          organization: string;
          employment_type: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string;
          responsibilities: string[];
          technologies: string[];
          accomplishments: string[];
          link_url: string | null;
          is_published: boolean;
          display_order: number;
          seed_key: string | null;
        },
        {
          id?: string;
          job_title: string;
          organization: string;
          employment_type: string;
          location?: string;
          start_date: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          responsibilities?: string[];
          technologies?: string[];
          accomplishments?: string[];
          link_url?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          seed_key?: string | null;
        }
      >;
      education: Table<
        Timestamped & {
          institution: string;
          qualification: string;
          field_of_study: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          details: string;
          is_published: boolean;
          display_order: number;
          seed_key: string | null;
        },
        {
          id?: string;
          institution: string;
          qualification: string;
          field_of_study: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          details?: string;
          is_published?: boolean;
          display_order?: number;
          seed_key?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      contact_settings: Table<
        {
          singleton: boolean;
          introduction: string;
          email: string;
          email_is_public: boolean;
          phone: string;
          phone_is_public: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          singleton?: boolean;
          introduction?: string;
          email: string;
          email_is_public?: boolean;
          phone?: string;
          phone_is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      social_links: Table<
        Timestamped & {
          platform: string;
          label: string;
          url: string;
          is_enabled: boolean;
          display_order: number;
        },
        {
          id?: string;
          platform: string;
          label: string;
          url: string;
          is_enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      creative_works: Table<
        Timestamped & {
          seed_key: string | null;
          title: string;
          category: string;
          description: string;
          media_type: "photo" | "video";
          image_media_id: string | null;
          legacy_image_url: string | null;
          image_alt: string | null;
          video_url: string | null;
          show_creator_credit: boolean;
          creator_credit: string | null;
          is_published: boolean;
          display_order: number;
        },
        {
          id?: string;
          seed_key?: string | null;
          title: string;
          category: string;
          description?: string;
          media_type: "photo" | "video";
          image_media_id?: string | null;
          legacy_image_url?: string | null;
          image_alt?: string | null;
          video_url?: string | null;
          show_creator_credit?: boolean;
          creator_credit?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
    Views: {
      public_contact_settings: {
        Row: {
          introduction: string;
          email: string | null;
          phone: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_portfolio_admin: { Args: Record<string, never>; Returns: boolean };
      replace_project_gallery: {
        Args: {
          p_project_id: string;
          p_media_ids: (string | null)[];
          p_legacy_urls: (string | null)[];
          p_captions: string[];
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
