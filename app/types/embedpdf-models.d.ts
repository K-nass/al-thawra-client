declare module '@embedpdf/models' {
  export type Rotation = 0 | 1 | 2 | 3;

  export const Rotation: {
    readonly Degree0: 0;
    readonly Degree90: 1;
    readonly Degree180: 2;
    readonly Degree270: 3;
  };
}
