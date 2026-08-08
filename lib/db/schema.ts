import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const professors = pgTable("professors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    voterId: text("voter_id").notNull(), // random client-side UUID, no login
    professorId: serial("professor_id")
      .notNull()
      .references(() => professors.id, { onDelete: "cascade" }),
    value: text("value").notNull(), // "like" | "dislike"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // one current vote per voter per professor, upsert on conflict
    voterProfessorUnique: unique().on(table.voterId, table.professorId),
  })
);