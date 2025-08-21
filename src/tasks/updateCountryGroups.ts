import { db } from "@/drizzle/db";
import countriesByDiscount from "@/data/countriesByDiscount.json";
import { CountryGroupTable, CountryTable } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

const groupCount = await updateCoutryGroups();

const countryCount = await updateCountries();

async function updateCoutryGroups() {
  const countryGroupInsertData = countriesByDiscount.map(
    ({ name, recommendedDiscountPercentage }) => {
      return { name, recommendedDiscountPercentage };
    }
  );

  const { rowCount } = await db
    .insert(CountryGroupTable)
    .values(countryGroupInsertData)
    .onConflictDoUpdate({
      target: CountryGroupTable.name,
      set: {
        recommendedDiscountPercentage: sql.raw(
          `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`
        ),
      },
    });

  revalidateDbCache({ tag: CACHE_TAGS.countryGroups });

  return rowCount;
}

async function updateCountries() {
  const countryGroups = await db.query.CountryGroupTable.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  const countryInsertData = countriesByDiscount.flatMap(
    ({ countries, name }) => {
      const countryGroup = countryGroups.find((group) => group.name === name);
      if (countryGroup == null) {
        throw new Error(`Country group "${name}" not found`);
      }
      return countries.map((country) => {
        return {
          name: country.countryName,
          code: country.country,
          countryGroupId: countryGroup.id,
        };
      });
    }
  );

  const { rowCount } = await db
    .insert(CountryTable)
    .values(countryInsertData)
    .onConflictDoUpdate({
      target: CountryTable.code,
      set: {
        name: sql.raw(`excluded.${CountryTable.name.name}`),
        countryGroupId: sql.raw(`excluded.${CountryTable.countryGroupId.name}`),
      },
    });

  // revalidateDbCache({ tag: CACHE_TAGS.countries });

  return rowCount;
}
