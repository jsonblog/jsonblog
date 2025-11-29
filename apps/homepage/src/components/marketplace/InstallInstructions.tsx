'use client';

import { useState } from 'react';

interface InstallInstructionsProps {
  packageName: string;
  installCommand: string;
  usageExample?: string;
}

export function InstallInstructions({
  packageName,
  installCommand,
  usageExample,
}: InstallInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const cliCommand = `jsonblog build --generator ${packageName}`;

  return (
    <div className="space-y-4">
      {/* npm Installation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">npm Install</h4>
          <button
            onClick={() => copyToClipboard(installCommand, 'install')}
            className="text-xs text-accent hover:underline"
          >
            {copied === 'install' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs break-all">
          {installCommand}
        </div>
      </div>

      {/* CLI Usage */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">Use with JSONBlog CLI</h4>
          <button
            onClick={() => copyToClipboard(cliCommand, 'cli')}
            className="text-xs text-accent hover:underline"
          >
            {copied === 'cli' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs break-all">
          {cliCommand}
        </div>
      </div>

      {/* Programmatic Usage */}
      {usageExample && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Programmatic Usage</h4>
            <button
              onClick={() => copyToClipboard(usageExample, 'usage')}
              className="text-xs text-accent hover:underline"
            >
              {copied === 'usage' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-xs font-mono">
              <code>{usageExample}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
