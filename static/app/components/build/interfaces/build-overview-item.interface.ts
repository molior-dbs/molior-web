export interface BuildOverviewItem {
  git_ref?: string;
  can_rebuild: boolean;
  branch?: string;
  buildvariant: Buildvariant;
  sourcename: string;
  endstamp: string;
  startstamp: string;
  id: number;
  buildstate: string;
  version: string;
  sourcerepository: Sourcerepository;
  maintainer: string;
  project: Project;
}

interface Project {
  id: number;
  name: string;
  version: Version;
}

interface Version {
  id: number;
  name: string;
  is_locked: boolean;
}

interface Sourcerepository {
  url: string;
  name: string;
  id: number;
}

interface Buildvariant {
  name: string;
  architecture: Architecture;
  base_mirror: Basemirror;
}

interface Basemirror {
  id: number;
  name: string;
  version: string;
}

interface Architecture {
  id: number;
  name: string;
}
