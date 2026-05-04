import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { parseJson } from "../lib/utils";
import { resolveTourAssets } from "../lib/tour-assets";

function toPublicPath(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

function isValidWebPath(src: string) {
  return src.startsWith("/") && !src.startsWith("public/") && !src.startsWith("/public/");
}

async function main() {
  const tours = await prisma.tour.findMany({ orderBy: { title: "asc" } });

  let toursWithValidImage = 0;
  let toursWithTwoGallery = 0;
  let errors = 0;

  for (const tour of tours) {
    const rawGallery = parseJson<string[]>(tour.galleryJson, []);
    const resolved = resolveTourAssets(tour.slug, tour.image, rawGallery);
    const routePhotos = resolved.gallery.slice(0, 2);

    const imagePathValid = Boolean(resolved.image && isValidWebPath(resolved.image));
    const imageExists = imagePathValid && fs.existsSync(toPublicPath(resolved.image));

    const galleryArrayValid = Array.isArray(resolved.gallery);
    const galleryEnough = galleryArrayValid && routePhotos.length >= 2;

    const g1 = routePhotos[0] ?? "";
    const g2 = routePhotos[1] ?? "";

    const g1PathValid = Boolean(g1 && isValidWebPath(g1));
    const g2PathValid = Boolean(g2 && isValidWebPath(g2));

    const g1Exists = g1PathValid && fs.existsSync(toPublicPath(g1));
    const g2Exists = g2PathValid && fs.existsSync(toPublicPath(g2));

    const imageOk = imagePathValid && imageExists;
    const galleryOk = galleryEnough && g1PathValid && g2PathValid && g1Exists && g2Exists;

    if (imageOk) toursWithValidImage += 1;
    if (galleryOk) toursWithTwoGallery += 1;

    console.log(`\n${tour.title}`);
    console.log(`slug: ${tour.slug}`);
    console.log(`image: ${resolved.image || "<missing>"} | path: ${imagePathValid} | exists: ${imageExists}`);
    console.log(`gallery[0]: ${g1 || "<missing>"} | path: ${g1PathValid} | exists: ${g1Exists}`);
    console.log(`gallery[1]: ${g2 || "<missing>"} | path: ${g2PathValid} | exists: ${g2Exists}`);

    if (!imageOk || !galleryOk) {
      errors += 1;
      if (!imagePathValid) console.error("  ERROR: image path is invalid");
      if (!imageExists) console.error("  ERROR: image file does not exist");
      if (!galleryArrayValid) console.error("  ERROR: gallery is not an array");
      if (!galleryEnough) console.error("  ERROR: gallery has less than 2 images");
      if (!g1PathValid || !g2PathValid) console.error("  ERROR: gallery path format is invalid");
      if (!g1Exists || !g2Exists) console.error("  ERROR: gallery file does not exist");
    }
  }

  console.log(`\n${toursWithValidImage}/${tours.length} tours have valid image`);
  console.log(`${toursWithTwoGallery}/${tours.length} tours have at least 2 valid gallery images`);

  if (errors > 0) {
    console.error(`Verification failed for ${errors} tours.`);
    process.exit(1);
  }

  console.log("All tour assets are valid.");
}

main()
  .catch((error) => {
    console.error("verify-tour-assets failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
