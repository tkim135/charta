import sys
import argparse
import string
import yaml
from collections import defaultdict
import copy
from pprint import pprint


description = "Recommender system. TODO: Finish me"
parser = argparse.ArgumentParser(description=description)
parser.add_argument("-r", "--requirement", help="Requirement(s) the class should fulfill")
parser.add_argument("-m", "--major", help="Majors to focus on")
parser.add_argument("-t", "--term", help="Term(s) to focus on")
parser.add_argument("-v", "--verbose", action='count')

args = parser.parse_args()

# TODO: point to file in courses_api folder
course_dict_path = 'courses_w_terms.yaml'
course_dict = {}
# for now just looking at school of engineering
school = 'School of Engineering'
majors = []
terms = []
verbose = False

def read_courses():
    if verbose: print('Gathering class info...\n')
    with open(course_dict_path) as f:
        courses = yaml.safe_load(f)
        if verbose: print('Finished gathering class info...\n')
        return courses

def filter_courses(terms):
    if verbose: print('Filtering by selected term(s)...\n')
    filtered_courses = copy.deepcopy(course_dict)
    for major in majors:
        major_courses = course_dict[school][major]
        for course in major_courses:
            if len(set(terms).intersection(set(major_courses[course]['Terms']))) == 0:
                del filtered_courses[school][major][course]
    return filtered_courses

def get_classes_with_req(requirements, majors, terms):
    if verbose: print('Finding classes with selected requirements...\n')
    recommended_courses = defaultdict(list)
    for major in majors:
        major = major.strip()
        major_courses = course_dict[school][major]
        for course in major_courses:
            if len(set(terms).intersection(set(major_courses[course]['Terms']))) == 0 and len(terms) > 0:
                continue

            ger = major_courses[course]['GER']
            ger = [g.strip() for g in ger]
            req_class_meets = set(requirements).intersection(set(ger))

            if len(req_class_meets) > 0:
                course_title = '%s%s: %s' % (major, major_courses[course]['Code'], course)
                course_terms = major_courses[course]['Terms']
                recommended_courses[tuple(req_class_meets)].append((course_title, course_terms))
    return recommended_courses


def print_recommendations(recommended_courses):
    for req in recommended_courses:
        courses = recommended_courses[req]
        print('\n')
        print('****************************************************')
        print("Courses that satisfy: ", req)
        for course, course_term in courses:
            print(course)
            print("\t Terms offered: ", course_term, "\n")
        print('****************************************************')


if __name__ == '__main__':
    if args.verbose:
        verbose = True

    course_dict = read_courses()
    majors = course_dict.keys()

    if args.major:
        majors = list(args.major.split(','))
        majors = [m.strip() for m in majors]

    if args.term:
        terms = list(args.term.split(','))
        terms = [t.strip() for t in terms]
        # course_dict = filter_courses(terms)

    if args.requirement:
        requirements = list(args.requirement.split(','))
        requirements = [r.strip() for r in requirements]
        recommended_courses = get_classes_with_req(requirements, majors, terms)
        print_recommendations(recommended_courses)
