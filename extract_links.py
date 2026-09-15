import PyPDF2
import sys

def extract_links(pdf_path):
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            if '/Annots' in page:
                annots = page['/Annots']
                for annot in annots:
                    obj = annot.get_object()
                    if '/A' in obj and '/URI' in obj['/A']:
                        print(f"Page {page_num + 1}: {obj['/A']['/URI']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_links("MdFardinAhmed_CV.pdf")