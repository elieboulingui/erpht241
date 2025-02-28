"use client"

import { useState } from "react"

interface VersionSwitcherProps {
  versions: string[]
  defaultVersion: string
}

export function VersionSwitcher({ versions, defaultVersion }: VersionSwitcherProps) {
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion)

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="version-select" className="text-sm font-medium">
        Version:
      </label>
      <select
        id="version-select"
        value={selectedVersion}
        onChange={(e) => setSelectedVersion(e.target.value)}
        className="text-sm border rounded p-1"
      >
        {versions.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </select>
    </div>
  )
}

