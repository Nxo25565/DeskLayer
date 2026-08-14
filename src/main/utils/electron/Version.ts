import { VersionInfo } from '../../../shared/Types/VersionInfo'

export function getVersion(): VersionInfo {
  return {
    node_ver: process.versions.node,
    electron_ver: process.versions.electron,
    vite_ver: process.versions.vite,
    deskLayer_ver: 'a0.0.1' // TODO: get version from package.json
  }
}
