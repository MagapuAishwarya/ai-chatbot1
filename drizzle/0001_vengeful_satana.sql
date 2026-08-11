CREATE TABLE "knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"chunk" text NOT NULL,
	"embedding" vector(3072) NOT NULL
);
