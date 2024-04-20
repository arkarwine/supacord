import { Database } from './database.types'

type PublicTables = Database['public']['Tables']
type PublicViews = Database['public']['Views']

export type Profile = PublicTables['profiles']['Row']

export type Message = PublicTables['messages']['Row']

export type InsertMessage = PublicTables['messages']['Insert']

export type ChatView = PublicViews['get_chats']['Row']
