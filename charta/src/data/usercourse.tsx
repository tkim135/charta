class UserCourse {
    code: string;
    reason: string;
    gradingBasis: string;
    units: number;
    term: string;
    title: string;

    constructor(code: string, reason: string, gradingBasis: string, units: number, term: string, title: string) {
        this.code = code;
        this.reason = reason;
        this.gradingBasis = gradingBasis;
        this.units = units;
        this.term = term;
        this.title = title;
    }

}

export default UserCourse;