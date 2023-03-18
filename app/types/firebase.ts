export interface Timestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}
