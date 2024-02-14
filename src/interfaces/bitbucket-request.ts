export default interface BitBucketRequestI<T> {
  values: T[];
  pagelen: number;
  size: number;
  page: number;
}
