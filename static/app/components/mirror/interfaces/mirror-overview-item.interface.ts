/**
 * The mirror item interface
 */
export interface MirrorItem {
  url: string;
  name: string;
  version: string;
  state: string;
  architectures: string;
  is_basemirror: boolean;
  distribution: string;
  project_id: number;
  id: number;
  apt_url: string;
  is_locked: boolean;
  base_mirror: string;
  components: string;
}
