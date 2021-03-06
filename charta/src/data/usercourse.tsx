class UserCourse {
    code: string;
    reason: string;
    grade: string;
    units: number;
    ways: string;
    term: string;
    title: string;
    id: string;

    constructor(code: string, reason: string, grade: string, units: number, ways: string, term: string, title: string, id: string) {
        this.code = code;
        this.reason = reason;
        this.grade = grade;
        this.units = units;
        this.ways = ways;
        this.term = term;
        this.title = title;
        this.id = id;
    }

}

export default UserCourse;