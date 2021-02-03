# The code at this point has been heavily adapted from the explore-courses-api repository.
# https://github.com/jeremyephron/explore-courses-api

from explorecourses import *
from explorecourses import filters

connect = CourseConnection()

# Print out all courses for 2020-2021.
year = "2020-2021"
num_courses = 0
for school in connect.get_schools(year):
    for dept in school.departments:
        courses = connect.get_courses_by_department(dept.code, year=year)
        for course in courses:
            num_courses += 1
        print(dept, num_courses)
print(num_courses)
