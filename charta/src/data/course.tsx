// class Course {
//     readonly codes: Array<string>;
//     readonly description: string;
//     readonly GER: Array<string>;
//     readonly gradingBasis: string;
//     readonly minUnits: number;
//     readonly maxUnits: number;
//     readonly terms: Array<string>;
//     readonly title: string;
//
//     constructor(codes: Array<string>, description: string, GER: Array<string>, gradingBasis: string, minUnits: number, maxUnits: number, terms: Array<string>, title: string) {
//         this.codes = codes;
//         this.description = description;
//         this.GER = GER;
//         this.gradingBasis = gradingBasis;
//         this.minUnits = minUnits;
//         this.maxUnits = maxUnits;
//         this.terms = terms;
//         this.title = title;
//
//     }
//
// }
//
// export default Course;

 interface Course{
    readonly codes: Array<string>;
    readonly description: string;
    readonly GER: Array<string>;
    readonly gradingBasis: string;
    readonly minUnits: number;
    readonly maxUnits: number;
    readonly terms: Array<string>;
    readonly title: string;
}

export default  Course;
