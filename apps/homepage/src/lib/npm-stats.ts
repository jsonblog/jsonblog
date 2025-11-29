import type { GeneratorMetadata } from './generators';

interface NpmDownloads {
  package: string;
  downloads: number;
}

interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  time: {
    modified: string;
    [version: string]: string;
  };
}

export async function fetchNpmDownloads(packageName: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      console.warn(`Failed to fetch downloads for ${packageName}`);
      return 0;
    }

    const data: NpmDownloads = await response.json();
    return data.downloads || 0;
  } catch (error) {
    console.error(`Error fetching npm downloads for ${packageName}:`, error);
    return 0;
  }
}

export async function fetchNpmPackageInfo(packageName: string): Promise<Partial<NpmPackageInfo>> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch package info for ${packageName}`);
      return {};
    }

    const data = await response.json();
    return {
      'dist-tags': data['dist-tags'],
      time: data.time,
    };
  } catch (error) {
    console.error(`Error fetching npm package info for ${packageName}:`, error);
    return {};
  }
}

export async function enrichGeneratorWithStats(
  generator: GeneratorMetadata
): Promise<GeneratorMetadata> {
  const [downloads, packageInfo] = await Promise.all([
    fetchNpmDownloads(generator.npmPackage),
    fetchNpmPackageInfo(generator.npmPackage),
  ]);

  return {
    ...generator,
    stats: {
      weeklyDownloads: downloads,
      lastPublished: packageInfo.time?.modified,
    },
  };
}
