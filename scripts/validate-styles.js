#!/usr/bin/env node

/**
 * Validate all style JSON files against the schema.
 * Usage: node scripts/validate-styles.js
 */

import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STYLES_DIR = join(__dirname, "..", "src", "styles");
const SCHEMA = JSON.parse(readFileSync(join(STYLES_DIR, "_schema.json"), "utf-8"));

const REQUIRED_VARIABLES = SCHEMA.properties.variables.required;
const VALID_CATEGORIES = SCHEMA.properties.category.enum;
const VALID_TUNING_TYPES = ["range", "color", "select"];

let errors = 0;
let validated = 0;

function error(file, msg) {
  console.error(`  ❌ ${file}: ${msg}`);
  errors++;
}

function ok(file) {
  console.log(`  ✅ ${file}`);
  validated++;
}

console.log("\n🔍 Validating style JSON files...\n");

const files = readdirSync(STYLES_DIR).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

if (files.length === 0) {
  console.error("  ⚠️  No style JSON files found!");
  process.exit(1);
}

for (const file of files) {
  const filePath = join(STYLES_DIR, file);
  let data;

  try {
    data = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (e) {
    error(file, `Invalid JSON: ${e.message}`);
    continue;
  }

  const expectedId = basename(file, ".json");
  let fileHasError = false;

  // Check required fields
  for (const field of SCHEMA.required) {
    if (data[field] === undefined) {
      error(file, `Missing required field: ${field}`);
      fileHasError = true;
    }
  }

  if (fileHasError) continue;

  // Check id matches filename
  if (data.id !== expectedId) {
    error(file, `id "${data.id}" does not match filename "${expectedId}"`);
    fileHasError = true;
  }

  // Check category
  if (!VALID_CATEGORIES.includes(data.category)) {
    error(file, `Invalid category "${data.category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`);
    fileHasError = true;
  }

  // Check required variables
  for (const varName of REQUIRED_VARIABLES) {
    if (!data.variables[varName]) {
      error(file, `Missing required variable: ${varName}`);
      fileHasError = true;
    }
  }

  // Check specialTuning
  if (Array.isArray(data.specialTuning)) {
    for (const tuning of data.specialTuning) {
      if (!tuning.variable || !tuning.label || !tuning.type) {
        error(file, `specialTuning entry missing required fields (variable, label, type)`);
        fileHasError = true;
      }
      if (tuning.type && !VALID_TUNING_TYPES.includes(tuning.type)) {
        error(file, `Invalid tuning type "${tuning.type}". Must be one of: ${VALID_TUNING_TYPES.join(", ")}`);
        fileHasError = true;
      }
    }
  }

  // Check keyProperties
  if (!Array.isArray(data.keyProperties) || data.keyProperties.length < 1) {
    error(file, `keyProperties must have at least 1 entry`);
    fileHasError = true;
  }

  if (!fileHasError) {
    ok(file);
  }
}

console.log(`\n📊 Results: ${validated} passed, ${errors} errors\n`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log("✨ All style JSON files are valid!\n");
}
