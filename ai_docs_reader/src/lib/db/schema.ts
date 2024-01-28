import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ['system', 'user'])

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    pdfName: text("pdf_name").notNull(),
    pdfUrl: text("dpf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", {length: 255}).notNull(),
    filekey: text("file_key").notNull()
})

export const messages = pgTable("messsages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id").references(()=> chats.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    role: userSystemEnum("role").notNull()
})

