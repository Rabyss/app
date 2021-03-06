declare module _ {


  export interface LoDashStatic {
    rangeRight(start: number,
               end: number,
               step?: number): number[];

    /**
     * @see _.range
     */
    rangeRight(end: number,
               step?: number): number[];
  }
}
