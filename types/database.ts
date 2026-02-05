export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      answer_options: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          order_index: number
          question_id: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          order_index: number
          question_id?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          order_index?: number
          question_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_attempts: {
        Row: {
          assessment_id: string | null
          attempt_number: number
          enrollment_id: string | null
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          learner_id: string | null
          max_score: number | null
          passed: boolean | null
          percentage: number | null
          score: number | null
          started_at: string | null
          created_at: string | null
          status: Database["public"]["Enums"]["attempt_status"] | null
          submitted_at: string | null
          tab_switches: number | null
          violations: Json | null
        }
        Insert: {
          assessment_id?: string | null
          attempt_number: number
          enrollment_id?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          learner_id?: string | null
          max_score?: number | null
          passed?: boolean | null
          percentage?: number | null
          score?: number | null
          started_at?: string | null
          created_at?: string | null
          status?: Database["public"]["Enums"]["attempt_status"] | null
          submitted_at?: string | null
          tab_switches?: number | null
          violations?: Json | null
        }
        Update: {
          assessment_id?: string | null
          attempt_number?: number
          enrollment_id?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          learner_id?: string | null
          max_score?: number | null
          started_at?: string | null
          created_at?: string | null
          passed?: boolean | null
          percentage?: number | null
          score?: number | null
          status?: Database["public"]["Enums"]["attempt_status"] | null
          submitted_at?: string | null
          tab_switches?: number | null
          violations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          copy_paste_allowed: boolean | null
          created_at: string | null
          description: string | null
          dev_tools_allowed: boolean | null
          evaluation_duration_minutes: number | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          passing_score_percentage: number | null
          print_allowed: boolean | null
          proctoring_enabled: boolean | null
          right_click_allowed: boolean | null
          show_correct_answers: boolean | null
          show_results: Database["public"]["Enums"]["show_results"] | null
          shuffle_options: boolean | null
          shuffle_questions: boolean | null
          tab_switch_limit: number | null
          time_limit_minutes: number | null
          title: string
          total_marks: number | null
          type: Database["public"]["Enums"]["assessment_type"] | null
          updated_at: string | null
        }
        Insert: {
          copy_paste_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          dev_tools_allowed?: boolean | null
          evaluation_duration_minutes?: number | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score_percentage?: number | null
          print_allowed?: boolean | null
          proctoring_enabled?: boolean | null
          right_click_allowed?: boolean | null
          show_correct_answers?: boolean | null
          show_results?: Database["public"]["Enums"]["show_results"] | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          tab_switch_limit?: number | null
          time_limit_minutes?: number | null
          title: string
          total_marks?: number | null
          type?: Database["public"]["Enums"]["assessment_type"] | null
          updated_at?: string | null
        }
        Update: {
          copy_paste_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          dev_tools_allowed?: boolean | null
          evaluation_duration_minutes?: number | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score_percentage?: number | null
          print_allowed?: boolean | null
          proctoring_enabled?: boolean | null
          right_click_allowed?: boolean | null
          show_correct_answers?: boolean | null
          show_results?: Database["public"]["Enums"]["show_results"] | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          tab_switch_limit?: number | null
          time_limit_minutes?: number | null
          title?: string
          total_marks?: number | null
          type?: Database["public"]["Enums"]["assessment_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          file_path: string
          file_size_bytes: number | null
          id: string
          lesson_id: string | null
          mime_type: string | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path: string
          file_size_bytes?: number | null
          id?: string
          lesson_id?: string | null
          mime_type?: string | null
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path?: string
          file_size_bytes?: number | null
          id?: string
          lesson_id?: string | null
          mime_type?: string | null
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      attempt_answers: {
        Row: {
          answer_text: string | null
          answered_at: string | null
          attempt_id: string | null
          feedback: string | null
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          question_id: string | null
          selected_option_id: string | null
        }
        Insert: {
          answer_text?: string | null
          answered_at?: string | null
          attempt_id?: string | null
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string | null
          selected_option_id?: string | null
        }
        Update: {
          answer_text?: string | null
          answered_at?: string | null
          attempt_id?: string | null
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string | null
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "answer_options"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          enrollment_id: string | null
          id: string
          issued_at: string | null
          metadata: Json | null
          pdf_url: string | null
          verification_code: string | null
        }
        Insert: {
          certificate_number: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          pdf_url?: string | null
          verification_code?: string | null
        }
        Update: {
          certificate_number?: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          pdf_url?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_instructors: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          instructor_id: string | null
          role: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_instructors_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          estimated_duration_hours: number | null
          id: string
          is_free: boolean | null
          language: string | null
          learning_objectives: string[] | null
          level: string | null
          prerequisites: string[] | null
          preview_video_url: string | null
          price: number | null
          published_at: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          subtitle: string | null
          tags: string[] | null
          target_audience: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          language?: string | null
          learning_objectives?: string[] | null
          level?: string | null
          prerequisites?: string[] | null
          preview_video_url?: string | null
          price?: number | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          subtitle?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          language?: string | null
          learning_objectives?: string[] | null
          level?: string | null
          prerequisites?: string[] | null
          preview_video_url?: string | null
          price?: number | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          subtitle?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          enrolled_by: string | null
          id: string
          last_accessed_at: string | null
          learner_id: string | null
          progress_percentage: number | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          last_accessed_at?: string | null
          learner_id?: string | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          last_accessed_at?: string | null
          learner_id?: string | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_enrolled_by_fkey"
            columns: ["enrolled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          enrollment_id: string | null
          id: string
          last_position_seconds: number | null
          lesson_id: string | null
          progress_percentage: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["lesson_progress_status"] | null
          time_spent_seconds: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          enrollment_id?: string | null
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["lesson_progress_status"] | null
          time_spent_seconds?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          enrollment_id?: string | null
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["lesson_progress_status"] | null
          time_spent_seconds?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          order_index: number
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at: string | null
          week_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index: number
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string | null
          week_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title?: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          employee_id: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          employee_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          employee_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          assessment_id: string | null
          category: string | null
          created_at: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          duration_minutes: number | null
          explanation: string | null
          id: string
          is_active: boolean
          marks: number
          order_index: number
          subtopic: string | null
          title: string
          topic: string | null
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string | null
        }
        Insert: {
          assessment_id?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          duration_minutes?: number | null
          explanation?: string | null
          id?: string
          is_active?: boolean
          marks: number
          order_index: number
          subtopic?: string | null
          title: string
          topic?: string | null
          type: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          duration_minutes?: number | null
          explanation?: string | null
          id?: string
          is_active?: boolean
          marks?: number
          order_index?: number
          subtopic?: string | null
          title?: string
          topic?: string | null
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      weeks: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          order_index: number
          title: string
          unlock_date: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          order_index: number
          title: string
          unlock_date?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          order_index?: number
          title?: string
          unlock_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weeks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      assessment_type: "quiz" | "exam" | "practice"
      attempt_status: "in_progress" | "submitted" | "graded" | "expired"
      course_status: "draft" | "published" | "archived"
      difficulty: "easy" | "medium" | "hard"
      enrollment_status: "active" | "completed" | "dropped" | "suspended"
      lesson_progress_status: "not_started" | "in_progress" | "completed"
      lesson_type: "video" | "pdf" | "assessment"
      question_type: "multiple_choice" | "true_false" | "short_answer" | "essay"
      show_results:
      | "immediately"
      | "after_submission"
      | "after_due_date"
      | "never"
      user_role: "super_admin" | "admin" | "instructor" | "learner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      assessment_type: ["quiz", "exam", "practice"],
      attempt_status: ["in_progress", "submitted", "graded", "expired"],
      course_status: ["draft", "published", "archived"],
      difficulty: ["easy", "medium", "hard"],
      enrollment_status: ["active", "completed", "dropped", "suspended"],
      lesson_progress_status: ["not_started", "in_progress", "completed"],
      lesson_type: ["video", "pdf", "assessment"],
      question_type: ["multiple_choice", "true_false", "short_answer", "essay"],
      show_results: [
        "immediately",
        "after_submission",
        "after_due_date",
        "never",
      ],
      user_role: ["super_admin", "admin", "instructor", "learner"],
    },
  },
} as const
