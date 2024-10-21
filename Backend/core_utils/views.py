from django.shortcuts import render


from django.http import JsonResponse
from .utils.ocr_utils import pdf_to_ocr_text

def ocr_view(request):
    # pdf_path = request.GET.get('pdf_path')  # Get the PDF path from query parameters

    pdf_path = r'E:\University\Final Year Project\StudyBuddy-FYP\Backend\entrytest\books\2018-G11-Biology-E.pdf'
    textfile_path = '1styearbio.txt' # Enter pdf file path here"
    try:
        extracted_text = pdf_to_ocr_text(pdf_path,textfile_path)
        return JsonResponse({'text': extracted_text})
    except FileNotFoundError as e:
        return JsonResponse({'error': str(e)}, status=400)
