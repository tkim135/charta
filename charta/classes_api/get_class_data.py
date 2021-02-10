# The code at this point has been heavily adapted from the explore-courses-api repository.
# https://github.com/jeremyephron/explore-courses-api

import sys
import time
import yaml

from explorecourses import *
from explorecourses import filters
from concurrent.futures import ThreadPoolExecutor # incorporate ThreadPool later


assert len(sys.argv) == 2, "Name of output YAML file required."

# name of output YAML file
out_file = sys.argv[1]

# connect to ExploreCourses API
connect = CourseConnection()

og_time = time.time()

# initialize course_dict that will became our YAML
course_dict = {}
# Print out all courses for 2020-2021.
year = "2020-2021"

for school in connect.get_schools(year):
    # loop through schools
    course_dict[school.name] = {}
    for dept in school.departments:
        # loop through departments within schools
        course_dict[school.name][dept.code] = {}
        # then courses within departments
        courses = connect.get_courses_by_department(dept.code, year=year)
        for course in courses:
            # specific quarters of the class are determined by course's sections
            terms = list(set(section.term for section in course.sections))
            course_dict[school.name][dept.code][course.title] = {
                "GER": course.gers,
                "Subject": course.subject,
                "Code": course.code,
                "Description": course.description,
                "Min Units": course.units_min,
                "Max Units": course.units_max,
                "Terms": terms
            }

f = open(out_file, "w")
f.write(yaml.safe_dump(course_dict)) # safe_dump for the tuple requirements
f.close()
