export interface StackType {
  mapCode: string;
  mapName: string;
}
export interface PointType {
  name?: string;
  coord: [number, number];
  stack: StackType[];
}

export interface PropsPointType {
  name: string;
  coord: [number, number];
}

export interface ScaleLimitType {
  min: number;
  max: number;
}
