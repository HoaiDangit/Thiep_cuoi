import { sqliteTable, text, integer, index, blob } from 'drizzle-orm/sqlite-core';
export const photos=sqliteTable('photos',{id:text('id').primaryKey(),owner:text('owner').notNull(),mime:text('mime').notNull(),data:blob('data',{mode:'buffer'}).notNull(),created:integer('created').notNull()},t=>[index('idx_photos_owner').on(t.owner)]);
export const adminSessions=sqliteTable('admin_sessions',{tokenHash:text('token_hash').primaryKey(),expires:integer('expires').notNull(),credentialTag:text('credential_tag').notNull(),username:text('username').notNull().default('admin')});
export const adminLoginAttempts=sqliteTable('admin_login_attempts',{key:text('key').primaryKey(),attempts:integer('attempts').notNull(),expires:integer('expires').notNull()});
export const weddings = sqliteTable('weddings', {
 id:text('id').primaryKey(), owner:text('owner').notNull().unique(), data:text('data').notNull(), updated:integer('updated').notNull()
});
export const guests = sqliteTable('guests', {
 token:text('token').primaryKey(), weddingId:text('wedding_id').notNull().references(()=>weddings.id), name:text('name').notNull(), honorific:text('honorific').notNull().default(''), presentation:text('presentation').notNull().default('{}'), venueId:integer('venue_id').notNull().default(1), expires:integer('expires').notNull(), revoked:integer('revoked').notNull().default(0), created:integer('created').notNull()
},t=>[index('idx_guests_wedding').on(t.weddingId)]);

export const adminCredentials=sqliteTable('admin_credentials',{id:text('id').primaryKey(),salt:text('salt').notNull(),passwordHash:text('password_hash').notNull(),iterations:integer('iterations').notNull(),updated:integer('updated').notNull(),mustChange:integer('must_change').notNull().default(0),temporary:integer('temporary').notNull().default(0)});
export const adminSetupTokens=sqliteTable('admin_setup_tokens',{tokenHash:text('token_hash').primaryKey(),expires:integer('expires').notNull()});
