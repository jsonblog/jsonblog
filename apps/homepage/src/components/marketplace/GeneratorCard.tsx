import Link from 'next/link';
import Image from 'next/image';
import type { GeneratorMetadata } from '@/lib/generators';

interface GeneratorCardProps {
  generator: GeneratorMetadata;
}

export function GeneratorCard({ generator }: GeneratorCardProps) {
  return (
    <div className="block border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all overflow-hidden bg-white">
      {/* Screenshot Preview */}
      {generator.screenshot && (
        <div className="relative h-48 bg-gray-100">
          <Image
            src={generator.screenshot}
            alt={`${generator.displayName} screenshot`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold">{generator.displayName}</h3>
          <div className="flex gap-2">
            {generator.type === 'official' && (
              <span className="text-xs bg-accent text-white px-2 py-1 rounded">Official</span>
            )}
            {generator.status === 'beta' && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Beta</span>
            )}
            {generator.status === 'experimental' && (
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                Experimental
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary text-sm mb-4 line-clamp-2">{generator.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {generator.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {generator.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">+{generator.tags.length - 3}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-secondary mb-4">
          {generator.stats?.weeklyDownloads !== undefined && (
            <span>↓ {generator.stats.weeklyDownloads.toLocaleString()}/week</span>
          )}
          <span>v{generator.version}</span>
          <span className="capitalize">{generator.cssFramework || generator.templateEngine}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {generator.demoUrl && (
            <a
              href={generator.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-accent text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors text-sm"
            >
              View Demo
            </a>
          )}
          <Link
            href={`/marketplace/${generator.slug}`}
            className="flex-1 text-center border border-accent text-accent py-2 px-4 rounded hover:bg-accent hover:text-white transition-colors text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
