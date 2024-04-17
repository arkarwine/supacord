import { Database } from './database.types'

type PublicTable = Database['public']['Tables']

export type Profile = PublicTable['profiles']['Row']

export type Message = PublicTable['messages']['Row']

export type InsertMessage = PublicTable['messages']['Insert']
