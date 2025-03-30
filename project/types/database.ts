export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          pin: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          pin: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          pin?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: 'message' | 'event' | 'incident'
          title: string
          description: string
          priority: 'high' | 'normal'
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          type: 'message' | 'event' | 'incident'
          title: string
          description: string
          priority?: 'high' | 'normal'
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          type?: 'message' | 'event' | 'incident'
          title?: string
          description?: string
          priority?: 'high' | 'normal'
          created_at?: string
          created_by?: string
        }
      }
      access_logs: {
        Row: {
          id: string
          user_id: string
          type: 'entry' | 'exit'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'entry' | 'exit'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'entry' | 'exit'
          created_at?: string
        }
      }
    }
  }
}