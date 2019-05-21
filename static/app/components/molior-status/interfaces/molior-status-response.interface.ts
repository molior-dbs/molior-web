export interface MoliorStatusResponse {
  'molior-web': MoliorServiceStatus;
  'molior-srcpackager': MoliorServiceStatus;
  'molior-loghandler': MoliorServiceStatus;
  'molior-server': MoliorServiceStatus;
  'molior-scheduler': MoliorServiceStatus;
  'molior-internalrpc': MoliorServiceStatus;
  'molior-publisher': MoliorServiceStatus;
}

export interface MoliorServiceStatus {
  running: boolean;
  version: string;
}
