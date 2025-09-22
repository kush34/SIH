export interface RoadBlock {
  id?: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  severity: 'Low' | 'Medium' | 'High';
  reportedBy?: string;
  timestamp?: Date;
}
