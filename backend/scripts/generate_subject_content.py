# Note: The openai-python library support for Azure OpenAI is in preview.
import os
import openai
from api.app_config import OPENAI_API_KEY, simple_pydantic_model_config
import json
from pprint import pprint
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bunnet import init_bunnet
from scheduler.models import WarmupEmail
from scheduler.settings import MONGODB_CONN_STRING, DB_NAME, logger, BASE_DIR

client = MongoClient(MONGODB_CONN_STRING)
MODELS = [WarmupEmail]
init_bunnet(database=client[DB_NAME], document_models=MODELS)

# WarmupEmail.delete_all()

openai.api_type = "azure"
openai.api_base = "https://magicpitchopenai.openai.azure.com/"
openai.api_version = "2023-07-01-preview"

openai.api_key = OPENAI_API_KEY

template = """
Given an email subject "{subject}", generate a body for an actual email.it is about 150 words,the style must be written in such a way that it does not addresses to one person alone as we are sending bulk unpersonalized emails. our company name is magic pitch. out putu should be in json. also add a field falled responses, it will be a list of strings, which are responses to the body you will generate.        
do not include any form of placeholders , that is anything enclused in quare brackets. we intend to send your output directly to customers without proofreading. Make sure to format the body in html and use bulet points for lists ad so on . Remember if you enclse a text body in a p tag, ther is no need usinga br tag as it would add extra line. at the end it will be an email formated html. Do not start with "I hope this email finds you well". 
`responses` field must be an array of strings and must be positive and do atleast 5 responses. So the only fields will be `bdoy`, `responses` and `subject`.
"""

paraphraser_template = """
Return a paraphrased version of this string
'''{html_body}''' . remember to keep the tags intact as its html. 
If the body is personalized. A.k.a addressing to specific name, make it general (no name in specific)
"""


def get_paraphraser_response(html_body):
    response = openai.ChatCompletion.create(
        engine="warmup",
        messages=[
            {
                "role": "system",
                "content": "Act as an english professsional to paraphrase html formatted strings. Replace recipient name with actual name. Return html out put",
            },
            {
                "role": "user",
                "content": paraphraser_template.format(html_body=html_body),
            },
        ],
        temperature=0.7,
        max_tokens=800,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
    )

    generated_text = response["choices"][0]["message"]["content"]
    return generated_text


def get_model_response(subject):
    response = openai.ChatCompletion.create(
        engine="warmup",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant that helps people find information.",
            },
            {"role": "user", "content": template.format(subject=subject)},
        ],
        temperature=0.7,
        max_tokens=800,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
    )

    generated_text = response["choices"][0]["message"]["content"]
    # result_dict = json.loads(generated_text)

    return json.loads(generated_text.strip())


logger.info("Reading subject from text file ..")
with open(os.path.join(BASE_DIR, "datasets/clean_subjects.txt")) as sf:
    subjects = [
        subject.strip()
        for subject in sf.readlines()
        if not WarmupEmail.find(WarmupEmail.subject == subject.strip()).first_or_none()
    ]

total_subjects = len(subjects)

logger.info(f"Generating warmup-email for {total_subjects} subjects")
current_subject_index = 0

while current_subject_index < total_subjects:
    subject = subjects[current_subject_index]
    logger.info(f"[SUBJECT {current_subject_index+1}/{total_subjects}] - {subject}")

    try:
        warmup_email_dict = get_model_response(subject)
        warmup_email = WarmupEmail(
            subject=warmup_email_dict["subject"],
            body=warmup_email_dict["body"],
            responses=warmup_email_dict["responses"],
        )
        warmup_email.create()
        current_subject_index += 1
    except (KeyError, json.decoder.JSONDecodeError):
        logger.info("Failed parsing response from model.. retrying...")
    except DuplicateKeyError:
        current_subject_index += 1
