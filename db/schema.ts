import { sqliteTable, text, integer, index, blob } from 'drizzle-orm/sqlite-core';
export const photos=sqliteTable('photos',{id:text('id').primaryKey(),owner:text('owner').notNull(),mime:text('mime').notNull(),data:blob('data',{mode:'buffer'}).notNull(),created:integer('created').notNull()},t=>[index('idx_photos_owner').on(t.owner)]);
export const adminSessions=sqliteTable('admin_sessions',{tokenHash:text('token_hash').primaryKey(),expires:integer('expires').notNull(),credentialTag:text('credential_tag').notNull()});
export const adminLoginAttempts=sqliteTable('admin_login_attempts',{key:text('key').primaryKey(),attempts:integer('attempts').notNull(),expires:integer('expires').notNull()});
export const weddings = sqliteTable('weddings', {
 id:text('id').primaryKey(), owner:text('owner').notNull().unique(), data:text('data').notNull(), updated:integer('updated').notNull()
});
export const guests = sqliteTable('guests', {
 token:text('token').primaryKey(), weddingId:text('wedding_id').notNull().references(()=>weddings.id), name:text('name').notNull(), expires:integer('expires').notNull(), revoked:integer('revoked').notNull().default(0), created:integer('created').notNull()
},t=>[index('idx_guests_wedding').on(t.weddingId)]);
