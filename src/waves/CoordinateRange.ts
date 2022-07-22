export default class CoordinateRange {
    min: number;
    max: number;
    length: number;
  
    /**
     * Constructor function for the CoordinateRange class
     *
     * @param min minimum value of coordinate range
     * @param max maximum value of coordinate range
     */
  
    constructor(min: number, max: number) {
      this.min = min;
      this.max = max;
      this.length = max - min;
    }
  
    /**
     * This function returns a function to convert a value in [a,b] to be a value on [c, d] where [c, d]
     * are the minimum and maximum values of the class instance this method is called on.
     *
     * @param {CoordinateRange} coordinateRange coordinate basis of coordinate you're converting from
     * @returns {number} function that takes in a number from the old coordinate basis and gives a new number in 
     * the coordinate basis of the class instance the method was called on.
     */
    toOwnCoordinateBasis(
      coordinateRange: CoordinateRange
    ): (value: number) => number {
      return (value: number) => {
  
        if (value > coordinateRange.max) {
          throw new Error("Range Error: value is greater than original coordinate basis maximum.");
        };
  
        if (value < coordinateRange.min) {
          throw new Error("Range Error: value is less than original coordinate basis minimum.")
        }
  
        return ((value - coordinateRange.min) / coordinateRange.length) * this.length +
        this.min;
      }
       
    }
  }
  