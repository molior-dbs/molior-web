
/**
 * Architecture type from the molior api response
 */
export interface Architecture {

  /**
   * Name of the architecture like amd64 or armhf
   */
  name: string;

  /**
   * Database id of the architecture
   */
  id: number;
}
