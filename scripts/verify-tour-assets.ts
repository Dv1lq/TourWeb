import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { parseJson } from "../lib/utils";
import { resolveTourAssets } from "../lib/tour-assets";

function toPublicPath(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

async function main() {
  const tours = await prisma.tour.findMany({ orderBy: { title: "asc" } });
  let failures = 0;
  for (const tour of tours) {
    const gallery = parseJson<string[]>(tour.galleryJson, []);
    const resolved = resolveTourAssets(tour.slug, tour.image, gallery);
    const two = resolved.gallery.slice(0, 2);

    const imageExists = fs.existsSync(toPublicPath(resolved.image));
    const g1Exists = two[0] ? fs.existsSync(toPublicPath(two[0])) : false;
    const g2Exists = two[1] ? fs.existsSync(toPublicPath(two[1])) : false;

    console.log(`\n${tour.title}`);
    console.log(`slug: ${tour.slug}`);
    console.log(`image: ${resolved.image} exists: ${imageExists}`);
    console.log(`gallery[0]: ${two[0] ?? "<missing>"} exists: ${g1Exists}`);
    console.log(`gallery[1]: ${two[1] ?? "<missing>"} exists: ${g2Exists}`);

    if (!imageExists || !g1Exists || !g2Exists) failures += 1;
  }

  console.log(`\nTours checked: ${tours.length}`);
  if (failures > 0) {
    console.error(`Broken tours: ${failures}`);
    process.exit(1);
  }
  console.log("All tour assets are valid.");
}

main().finally(async () => {
  await prisma.$disconnect();
});
