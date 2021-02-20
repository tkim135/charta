import json
import yaml
import sys

assert len(sys.argv) == 3, "Name of input YAML and output JSON files required."

with open(sys.argv[1]) as yaml_file:
	courses_dict = yaml.load(yaml_file, Loader=yaml.FullLoader)

with open(sys.argv[2], "w") as json_file:
	json_file.write(json.dumps(courses_dict))