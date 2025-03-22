/* eslint-disable sort/object-properties */
import '@wsh-2025/schema/src/setups/luxon';

import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { DateTime } from 'luxon';

function parseTime(timeString: string): DateTime {
  const parsed = DateTime.fromFormat(timeString, 'HH:mm:ss').toObject();
  return DateTime.now().set({
    hour: parsed.hour,
    minute: parsed.minute,
    second: parsed.second,
    millisecond: 0,
  });
}

function formatTime(isoString: string): string {
  return DateTime.fromISO(isoString).toFormat('HH:mm:ss');
}

// 競技のため、時刻のみ保持して、日付は現在の日付にします
const startAtTimestamp = t.customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  fromDriver(timeString: string) {
    return parseTime(timeString).toISO();
  },
  toDriver(isoString: string) {
    return formatTime(isoString);
  },
});

// 競技のため、時刻のみ保持して、日付は現在の日付にします
// 放送終了時刻が 00:00:00 の場合は、翌日の 00:00:00 にします
const endAtTimestamp = t.customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  fromDriver(timeString: string) {
    const parsed = parseTime(timeString);
    if (DateTime.now().startOf('day').equals(parsed)) {
      return parsed.plus({ day: 1 }).toISO();
    }
    return parsed.toISO();
  },
  toDriver(isoString: string) {
    return formatTime(isoString);
  },
});

export const stream = table(
  'stream',
  {
    id: t.text('id').primaryKey(),
    numberOfChunks: t.integer('numberOfChunks').notNull(),
  },
  (table) => {
    return {
      idIdx: t.index('stream_id_idx').on(table.id),
    };
  }
);

export const series = table(
  'series',
  {
    id: t.text('id').primaryKey(),
    description: t.text('description').notNull(),
    thumbnailUrl: t.text('thumbnailUrl').notNull(),
    title: t.text('title').notNull(),
  },
  (table) => {
    return {
      idIdx: t.index('series_id_idx').on(table.id),
    };
  }
);

export const seriesRelation = relations(series, ({ many }) => ({
  episodes: many(episode),
}));

export const episode = table(
  'episode',
  {
    id: t.text('id').primaryKey(),
    description: t.text('description').notNull(),
    thumbnailUrl: t.text('thumbnailUrl').notNull(),
    title: t.text('title').notNull(),
    order: t.integer('order').notNull(),
    seriesId: t.text('seriesId')
      .notNull()
      .references(() => series.id),
    streamId: t.text('streamId')
      .notNull()
      .references(() => stream.id),
    premium: t.boolean('premium').notNull(),
  },
  (table) => {
    return {
      idIdx: t.index('episode_id_idx').on(table.id),
      seriesIdIdx: t.index('episode_seriesId_idx').on(table.seriesId),
      streamIdIdx: t.index('episode_streamId_idx').on(table.streamId),
    };
  }
);

export const episodeRelation = relations(episode, ({ one }) => ({
  series: one(series, {
    fields: [episode.seriesId],
    references: [series.id],
  }),
  stream: one(stream, {
    fields: [episode.streamId],
    references: [stream.id],
  }),
}));

export const channel = table(
  'channel',
  {
    id: t.text('id').primaryKey(),
    name: t.text('name').notNull(),
    logoUrl: t.text('logoUrl').notNull(),
  },
  (table) => {
    return {
      idIdx: t.index('channel_id_idx').on(table.id),
    };
  }
);

export const program = table(
  'program',
  {
    id: t.text('id').primaryKey(),
    title: t.text('title').notNull(),
    description: t.text('description').notNull(),
    startAt: startAtTimestamp().notNull(),
    endAt: endAtTimestamp().notNull(),
    thumbnailUrl: t.text('thumbnailUrl').notNull(),
    channelId: t.text('channelId')
      .notNull()
      .references(() => channel.id),
    episodeId: t.text('episodeId')
      .notNull()
      .references(() => episode.id),
  },
  (table) => {
    return {
      idIdx: t.index('program_id_idx').on(table.id),
      channelIdIdx: t.index('program_channelId_idx').on(table.channelId),
      episodeIdIdx: t.index('program_episodeId_idx').on(table.episodeId),
    };
  }
);

export const programRelation = relations(program, ({ one }) => ({
  channel: one(channel, {
    fields: [program.channelId],
    references: [channel.id],
  }),
  episode: one(episode, {
    fields: [program.episodeId],
    references: [episode.id],
  }),
}));

export const recommendedModule = table(
  'recommendedModule',
  {
    id: t.text('id').primaryKey(),
    order: t.integer('order').notNull(),
    title: t.text('title').notNull(),
    referenceId: t.text('referenceId').notNull(),
    type: t.text('type').notNull(),
  },
  (table) => {
    return {
      idIdx: t.index('recommendedModule_id_idx').on(table.id),
    };
  }
);

export const recommendedItem = table(
  'recommendedItem',
  {
    id: t.text('id').primaryKey(),
    order: t.integer('order').notNull(),
    moduleId: t.text('moduleId')
      .notNull()
      .references(() => recommendedModule.id),
    seriesId: t.text('seriesId').references(() => series.id),
    episodeId: t.text('episodeId').references(() => episode.id),
  },
  (table) => {
    return {
      idIdx: t.index('recommendedItem_id_idx').on(table.id),
      moduleIdIdx: t.index('recommendedItem_moduleId_idx').on(table.moduleId),
      seriesIdIdx: t.index('recommendedItem_seriesId_idx').on(table.seriesId),
      episodeIdIdx: t.index('recommendedItem_episodeId_idx').on(table.episodeId),
    };
  }
);

export const recommendedItemRelation = relations(recommendedItem, ({ one }) => ({
  module: one(recommendedModule, {
    fields: [recommendedItem.moduleId],
    references: [recommendedModule.id],
  }),
  series: one(series, {
    fields: [recommendedItem.seriesId],
    references: [series.id],
  }),
  episode: one(episode, {
    fields: [recommendedItem.episodeId],
    references: [episode.id],
  }),
}));

export const recommendedModuleRelation = relations(recommendedModule, ({ many }) => ({
  items: many(recommendedItem),
}));

export const user = table(
  'user',
  {
    id: t.serial('id').primaryKey().notNull(),
    email: t.text('email').notNull().unique(),
    password: t.text('password').notNull(),
  },
  (table) => {
    return {
      emailIdx: t.index('user_email_idx').on(table.email),
    };
  }
);
