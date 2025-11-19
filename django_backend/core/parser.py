import json
from rest_framework.parsers import MultiPartParser, DataAndFiles
from rest_framework.exceptions import ParseError


# data vanne field ma question ko JSON data aauxa, this will just extract that
#  and return as dict along with files
class QuestionMultipartJsonParser(MultiPartParser):
    question_data_field = 'data'
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(stream, media_type=media_type, parser_context=parser_context)
        data = result.data
        files = result.files
        question_json = data.get(self.question_data_field)
        if not question_json:
            raise ParseError(f"Missing '{self.question_data_field}' field")
        try:
            question_dict = json.loads(question_json.strip())
        except json.JSONDecodeError as e:
            raise ParseError(f"Invalid JSON in '{self.question_data_field}': {str(e)}")
        return DataAndFiles(question_dict, files=files)
