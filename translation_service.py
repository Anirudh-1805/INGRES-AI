# translation_service.py
# Modular translation logic for backend
# Uses Google Cloud Translate, AWS Translate, or Hugging Face IndicTrans2

import os
from transformers import pipeline

class TranslationService:
    def __init__(self, provider="google"):
        self.provider = provider
        if provider == "google":
            from google.cloud import translate_v2 as translate
            self.client = translate.Client()
        elif provider == "aws":
            import boto3
            self.client = boto3.client(
                'translate',
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION")
            )
        elif provider == "indictrans2":
            self.translator = pipeline("translation", model="ai4bharat/indictrans2-en-xx")

    def translate(self, text, source_lang, target_lang):
        if self.provider == "google":
            result = self.client.translate(
                text,
                source_language=source_lang,
                target_language=target_lang,
                format_="text"
            )
            return result['translatedText']
        elif self.provider == "aws":
            response = self.client.translate_text(
                Text=text,
                SourceLanguageCode=source_lang,
                TargetLanguageCode=target_lang
            )
            return response['TranslatedText']
        elif self.provider == "indictrans2":
            result = self.translator(text, src_lang=source_lang, tgt_lang=target_lang)
            return result[0]['translation_text']
        else:
            return text

# Usage:
# ts = TranslationService(provider="google")
# ts.translate("नमस्ते", "hi", "en")
