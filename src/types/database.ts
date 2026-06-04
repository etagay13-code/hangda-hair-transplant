export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type EmptyRelationships = [];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          locale: string;
          category: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string | null;
          locale?: string;
          category?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string | null;
          locale?: string;
          category?: string;
          updated_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string | null;
          description: string | null;
          content: string | null;
          image_url: string | null;
          icon: string | null;
          price_from: number | null;
          duration: string | null;
          locale: string;
          order_index: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description?: string | null;
          description?: string | null;
          content?: string | null;
          image_url?: string | null;
          icon?: string | null;
          price_from?: number | null;
          duration?: string | null;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string | null;
          description?: string | null;
          content?: string | null;
          image_url?: string | null;
          icon?: string | null;
          price_from?: number | null;
          duration?: string | null;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      gallery: {
        Row: {
          id: string;
          patient_code: string | null;
          category: string;
          technique: string | null;
          grafts: number | null;
          months_after: number | null;
          before_image_url: string | null;
          after_image_url: string | null;
          description: string | null;
          locale: string;
          is_active: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_code?: string | null;
          category?: string;
          technique?: string | null;
          grafts?: number | null;
          months_after?: number | null;
          before_image_url?: string | null;
          after_image_url?: string | null;
          description?: string | null;
          locale?: string;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_code?: string | null;
          category?: string;
          technique?: string | null;
          grafts?: number | null;
          months_after?: number | null;
          before_image_url?: string | null;
          after_image_url?: string | null;
          description?: string | null;
          locale?: string;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          author: string;
          category: string | null;
          tags: string[] | null;
          locale: string;
          is_published: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          author?: string;
          category?: string | null;
          tags?: string[] | null;
          locale?: string;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          author?: string;
          category?: string | null;
          tags?: string[] | null;
          locale?: string;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          country: string | null;
          message: string | null;
          service_interest: string | null;
          hair_loss_type: string | null;
          source_page: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          locale: string;
          status: string;
          notes: string | null;
          assigned_to: string | null;
          follow_up_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          message?: string | null;
          service_interest?: string | null;
          hair_loss_type?: string | null;
          source_page?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          locale?: string;
          status?: string;
          notes?: string | null;
          assigned_to?: string | null;
          follow_up_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          message?: string | null;
          service_interest?: string | null;
          hair_loss_type?: string | null;
          source_page?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          locale?: string;
          status?: string;
          notes?: string | null;
          assigned_to?: string | null;
          follow_up_date?: string | null;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          title: string | null;
          bio: string | null;
          image_url: string | null;
          specialization: string | null;
          locale: string;
          order_index: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          title?: string | null;
          bio?: string | null;
          image_url?: string | null;
          specialization?: string | null;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string | null;
          bio?: string | null;
          image_url?: string | null;
          specialization?: string | null;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Relationships: EmptyRelationships;
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          rating: number;
          comment: string | null;
          technique: string | null;
          grafts: number | null;
          image_url: string | null;
          video_url: string | null;
          locale: string;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string | null;
          rating?: number;
          comment?: string | null;
          technique?: string | null;
          grafts?: number | null;
          image_url?: string | null;
          video_url?: string | null;
          locale?: string;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string | null;
          rating?: number;
          comment?: string | null;
          technique?: string | null;
          grafts?: number | null;
          image_url?: string | null;
          video_url?: string | null;
          locale?: string;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      faq: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          locale: string;
          order_index: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string;
          locale?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Relationships: EmptyRelationships;
      };
      form_redirects: {
        Row: {
          id: string;
          form_name: string;
          success_url: string | null;
          email_to: string | null;
          email_cc: string | null;
          webhook_url: string | null;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_name: string;
          success_url?: string | null;
          email_to?: string | null;
          email_cc?: string | null;
          webhook_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_name?: string;
          success_url?: string | null;
          email_to?: string | null;
          email_cc?: string | null;
          webhook_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      page_seo: {
        Row: {
          id: string;
          page_key: string;
          locale: string;
          title: string | null;
          description: string | null;
          og_image: string | null;
          keywords: string | null;
          canonical_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          locale?: string;
          title?: string | null;
          description?: string | null;
          og_image?: string | null;
          keywords?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          locale?: string;
          title?: string | null;
          description?: string | null;
          og_image?: string | null;
          keywords?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      page_blocks: {
        Row: {
          id: string;
          page_key: string;
          section_key: string;
          locale: string;
          eyebrow: string | null;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_href: string | null;
          extra: Json | null;
          order_index: number;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          section_key: string;
          locale?: string;
          eyebrow?: string | null;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_href?: string | null;
          extra?: Json | null;
          order_index?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          section_key?: string;
          locale?: string;
          eyebrow?: string | null;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_href?: string | null;
          extra?: Json | null;
          order_index?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: EmptyRelationships;
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string | null;
          event_data: Json | null;
          page_url: string | null;
          locale: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type?: string | null;
          event_data?: Json | null;
          page_url?: string | null;
          locale?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string | null;
          event_data?: Json | null;
          page_url?: string | null;
          locale?: string | null;
          created_at?: string;
        };
        Relationships: EmptyRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type SiteSetting = Tables<'site_settings'>;
export type Service = Tables<'services'>;
export type GalleryItem = Tables<'gallery'>;
export type BlogPost = Tables<'blog_posts'>;
export type Contact = Tables<'contacts'>;
export type TeamMember = Tables<'team_members'>;
export type Testimonial = Tables<'testimonials'>;
export type Faq = Tables<'faq'>;
export type FormRedirect = Tables<'form_redirects'>;
export type PageSeo = Tables<'page_seo'>;
export type AnalyticsEvent = Tables<'analytics_events'>;
export type PageBlock = Tables<'page_blocks'>;
