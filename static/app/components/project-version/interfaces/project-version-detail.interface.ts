export interface ProjectVersionDetail {
  id: number;
  apt_url: string;
  mirror_architectures: string[];
  basemirror_url: string;
  mirror_state: string;
  name: string;
  dependencies: any[];
  project: Project;
  is_locked: boolean;
  ci_builds_enabled: boolean;
}

interface Project {
    is_mirror: boolean;
    id: number;
    description?: any;
    is_basemirror: boolean;
    name: string;
}
