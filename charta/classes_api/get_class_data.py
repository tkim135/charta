# The code at this point has been heavily adapted from the explore-courses-api repository.
# https://github.com/jeremyephron/explore-courses-api

import sys
import time
import yaml

from explorecourses import *
from explorecourses import filters

def populate_course_dict(course, course_dict):
    if course.course_id not in course_dict:
        # if class isn't in course dict, initialize entry
        course_dict[course.course_id] = {
            "Codes": [],
            "Description": course.description,
            "Min Units": course.units_min,
            "Max Units": course.units_max,
            "Terms": [],
            "GER": course.gers,
            "Grading Basis": course.grading_basis
        }
        # also add title
        # trim title if cross-lists appended at the end within parentheses
        paren_index = course.title.find('(')
        if paren_index != -1:
            # if cross-lists in title
            course_dict[course.course_id]["Title"] = \
                    course.title[:course.title.find('(')-1]
        else:
            # if not, use full title
            course_dict[course.course_id]["Title"] = course.title
    course_entry = course_dict[course.course_id]
    # update list of class codes
    curr_code = f"{course.subject} {course.code}"
    new_codes = list(set(course_entry["Codes"]).union({curr_code}))
    course_entry["Codes"] = new_codes
    # update list of offered terms
    # specific quarters of the class are determined by course's sections
    terms = set(section.term for section in course.sections)
    new_terms = list(set(course_entry["Terms"]).union(terms))
    course_entry["Terms"] = new_terms


if __name__ == "__main__":
    assert len(sys.argv) == 2, "Name of output YAML file required."

    # name of output YAML file
    out_file = sys.argv[1]

    # connect to ExploreCourses API
    connect = CourseConnection()

    og_time = time.time()

    # initialize course_dict that will became our YAML
    course_dict = {}
    # Print out all courses for 2020-2021.
    years = ["2016-2017", "2017-2018", "2018-2019", "2019-2020", "2020-2021"]

    for year in years:
        for school in connect.get_schools(year):
            # loop through schools
            for dept in school.departments:
                # loop through departments within schools
                # then courses within departments
                courses = connect.get_courses_by_department(dept.code, year=year)
                for course in courses:
                    populate_course_dict(course, course_dict)
            print(time.time()-og_time, f"Done with {year} {school}")

    f = open(out_file, "w")
    f.write(yaml.safe_dump(course_dict)) # safe_dump for the tuple requirements
    f.close()
