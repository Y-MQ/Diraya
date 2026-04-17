from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your Lovable URL after deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("AILM_API_KEY")
AILM_API_URL = os.getenv("AILM_API_URL")  # Paste exact URL from علم docs here

# ---------------------------------------------------------------
# PROMPTS
# ---------------------------------------------------------------

SIMPLIFY_PROMPT = """أنت مساعد تعليمي متخصص في مساعدة طلاب عسر القراءة.
خذ النص الأكاديمي التالي وأعِد بناءه بهذه الطريقة بالضبط:
- استبدل كل كلمة أكاديمية رسمية أو نادرة بأبسط مرادف عربي يومي
- قسّم كل جملة تحمل أكثر من فكرة إلى جملتين أو ثلاث قصيرة
- ضع الفاعل دائماً في بداية الجملة
- لا تحذف أي معلومة علمية أبداً
- اكتب النص كفقرات عادية مفصولة بنقطة بين كل جملة
أعِد النص المبسط فقط بدون أي مقدمة أو تعليق أو عنوان."""

MISSIONS_PROMPT = """أنت مساعد تعليمي متخصص في مساعدة طلاب ADHD.
حوّل النص الأكاديمي التالي إلى قائمة مهمات تعلم بهذا الشكل الدقيق جداً:

١- ستتعلم الآن: [عنوان الموضوع]
[اكتب هنا 2-3 جمل تشرح الموضوع بشكل واضح وبسيط]

٢- ستتعلم الآن: [عنوان الموضوع]
[اكتب هنا 2-3 جمل تشرح الموضوع بشكل واضح وبسيط]

القواعد:
- كل مهمة تبدأ بسطر "ستتعلم الآن:" ثم سطر جديد للشرح
- الشرح لا يتجاوز 3 جمل
- اترك سطراً فارغاً بين كل مهمة
- أعد القائمة فقط بدون أي مقدمة"""
# ---------------------------------------------------------------
# MODELS
# ---------------------------------------------------------------

class ProcessRequest(BaseModel):
    text: str
    mode: str  # "simplify" or "missions"

# ---------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------

@app.get("/")
def health_check():
    return {"status": "دراية backend is running ✓"}

@app.post("/process")
async def process_text(request: ProcessRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="النص فارغ")

    if request.mode not in ["simplify", "missions"]:
        raise HTTPException(status_code=400, detail="النمط غير صحيح")

    if not API_KEY:
        raise HTTPException(status_code=500, detail="مفتاح API غير موجود")

    if not AILM_API_URL:
        raise HTTPException(status_code=500, detail="رابط API غير موجود")

    prompt = SIMPLIFY_PROMPT if request.mode == "simplify" else MISSIONS_PROMPT

    try:
        response = requests.post(
            AILM_API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "nuha-2.0",  # confirm exact name from علم docs
                "messages": [
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": request.text}
                ],
                "max_tokens": 2000,
                "temperature": 0.3
            },
            timeout=30
        )

        response.raise_for_status()
        data = response.json()
        result = data["choices"][0]["message"]["content"]
        return {"result": result}

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="انتهت مهلة الاتصال، حاول مرة أخرى")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"خطأ في الاتصال: {str(e)}")
