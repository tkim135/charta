class Course {
    id: string;
    codes: Array<string>;
    description: string;
    GER: Array<string>;
    gradingBasis: string;
    minUnits: number;
    maxUnits: number;
    terms: Array<string>;
    title: string;

    constructor(id: string, codes: Array<string>, description: string, GER: Array<string>, gradingBasis: string, minUnits: number, maxUnits: number, terms: Array<string>, title: string) {
        this.id = id;
        this.codes = codes;
        this.description = description;
        this.GER = GER;
        this.gradingBasis = gradingBasis;
        this.minUnits = minUnits;
        this.maxUnits = maxUnits;
        this.terms = this.sortTerms(terms);
        this.title = title;
    }

    public sortTerms(terms: Array<string>) {
        let sortedArray: string[] = terms.sort((n1,n2) => {
            if (n1.substring(0,9) > n2.substring(0,9)) {
                return 1;
            }

            if (n1.substring(0,9) < n2.substring(0,9)) {
                return -1;
            }
            // if years are equal, compare "Autumn", "Winter", or "Spring"
            // winter and spring are exceptions to alphabetical rule
            // otherwise, alphabetical comparisons work
            if (n1.substring(10) === "Winter" && n2.substring(10) === "Spring") {
                return -1;
            }
            if (n2.substring(10) === "Winter" && n1.substring(10) === "Spring") {
                return 1;
            }

            // alphabetical
            if (n1.substring(10) < n2.substring(10)) {
                return -1;
            }

            if (n1.substring(10) > n2.substring(10)) {
                return 1;
            }

            return 0;
        });
        return sortedArray;
    }
}

export default Course;
