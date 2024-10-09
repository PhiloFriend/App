export interface ReflectionResult {
  quote: string;
  story: string;
  reflection: string;
  application: string;
  sharableCaption: string;
  image: string | null;
}

export interface Reflection {
  _id?: string;
  owner: string;
  reflectionText: string;
  reflectionType: string;
  result?: ReflectionResult;
  createdAt: Date;
  updatedAt: Date;
}
