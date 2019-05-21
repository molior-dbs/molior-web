export interface ProjectDetail {
  versions: Version[];
  id: number;
  versions_map: Versionsmap;
  name: string;
}

interface Versionsmap {
  [key: string]: string;
}

export interface Version {
  id: number;
  is_locked: boolean;
  name: string;
}
