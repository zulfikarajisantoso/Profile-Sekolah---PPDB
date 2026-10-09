import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('admin_users', (table) => {
    table.increments('id').primary()
    table.string('username', 64).notNullable().unique()
    table.string('password_hash', 255).notNullable()
    table.string('full_name', 120).notNullable().defaultTo('')
    table.string('role', 32).notNullable().defaultTo('editor')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('news', (table) => {
    table.increments('id').primary()
    table.string('title', 200).notNullable()
    table.string('slug', 220).notNullable().unique()
    table.text('excerpt').notNullable().defaultTo('')
    table.text('content').notNullable().defaultTo('')
    table.string('cover_image', 255).nullable()
    table.string('category', 64).notNullable().defaultTo('berita')
    table.boolean('is_published').notNullable().defaultTo(true)
    table.integer('author_id').unsigned().nullable()
    table.timestamp('published_at').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

    table.foreign('author_id').references('admin_users.id').onDelete('SET NULL')
    table.index('published_at', 'idx_news_published_at')
    table.index('is_published', 'idx_news_is_published')
  })

  await knex.schema.createTable('teachers', (table) => {
    table.increments('id').primary()
    table.string('name', 120).notNullable()
    table.string('nip', 40).nullable()
    table.string('subject', 120).notNullable().defaultTo('')
    table.string('position', 120).notNullable().defaultTo('')
    table.string('photo', 255).nullable()
    table.text('bio').notNullable().defaultTo('')
    table.integer('sort_order').notNullable().defaultTo(0)
    table.boolean('is_active').notNullable().defaultTo(true)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.index('sort_order', 'idx_teachers_sort_order')
  })

  await knex.schema.createTable('achievements', (table) => {
    table.increments('id').primary()
    table.string('title', 200).notNullable()
    table.string('level', 64).notNullable().defaultTo('sekolah')
    table.integer('year').notNullable()
    table.string('holder', 160).notNullable().defaultTo('')
    table.string('image', 255).nullable()
    table.text('description').notNullable().defaultTo('')
    table.integer('sort_order').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.index('year', 'idx_achievements_year')
  })

  await knex.schema.createTable('ppdb_registrations', (table) => {
    table.increments('id').primary()
    table.string('registration_number', 32).notNullable().unique()

    table.string('student_name', 120).notNullable()
    table.string('student_nisn', 32).nullable()
    table.string('gender', 16).notNullable()
    table.string('birth_place', 80).notNullable()
    table.date('birth_date').notNullable()
    table.string('religion', 40).notNullable()
    table.string('origin_school', 160).notNullable().defaultTo('')
    table.string('address', 255).notNullable()
    table.string('village', 80).notNullable().defaultTo('')
    table.string('district', 80).notNullable().defaultTo('')

    table.string('parent_name', 120).notNullable()
    table.string('parent_phone', 32).notNullable()
    table.string('parent_email', 160).notNullable().defaultTo('')
    table.string('parent_job', 100).notNullable().defaultTo('')

    table.string('program', 80).notNullable()
    table.text('note').notNullable().defaultTo('')
    table.text('documents').notNullable().defaultTo('[]')

    table.string('status', 24).notNullable().defaultTo('baru')
    table.text('admin_note').notNullable().defaultTo('')

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.index('status', 'idx_ppdb_status')
    table.index('created_at', 'idx_ppdb_created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('ppdb_registrations')
  await knex.schema.dropTableIfExists('achievements')
  await knex.schema.dropTableIfExists('teachers')
  await knex.schema.dropTableIfExists('news')
  await knex.schema.dropTableIfExists('admin_users')
}
