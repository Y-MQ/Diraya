دراية — Diraya 🎓

لأن الفهم حق راسخ، لا امتياز مكتسب

عن المشروع
دراية منصة تعليمية ذكية مصممة خصيصاً لطلاب عسر القراءة (Dyslexia) واضطراب تشتت الانتباه (ADHD). تأخذ أي نص أكاديمي عربي وتعيد بناءه بطريقة يفهمها عقل الطالب.
 الميزات 
 
ركيزة 1 — تبسيط المصطلحات (لطلاب Dyslexia)

استبدال المصطلحات الأكاديمية الصعبة بكلمات مألوفة
قارئ تفاعلي يُبرز النص كلمة بكلمة أو جملة بجملة
تحكم كامل في حجم النص وكمية التمييز عبر sliders

ركيزة 2 — وضع المهمات (لطلاب ADHD)

تحويل المحتوى الطويل إلى مهمات تعلم واضحة ومرقمة
عرض مهمة واحدة في كل مرة مع شريط تقدم
كل مهمة تبدأ بهدف واضح

التقنيات المستخدمة
تم بناء الواجهة الأمامية باستخدام React.js، بينما تم تطوير الخادم باستخدام FastAPI. 
كما يعتمد النظام على الذكاء الاصطناعي من خلال Nuha 2.0. تم نشر الواجهة الأمامية عبر Vercel، في حين تم استضافة الخادم على Railway.



🚀 روابط المشروع

🌐 الموقع: https://diraya-beta.vercel.app
💻 الكود: https://github.com/Y-MQ/Diraya

🔑 كيفية التشغيل محلياً
Backend
bashcd backend
pip install -r requirements.txt
cp .env.example .env
# أضف مفتاح API في ملف .env
uvicorn main:app --reload
Frontend
bashcd diraya_project
npm install
npm run dev
📋 المتغيرات البيئية
AILM_API_KEY=your_api_key
AILM_API_URL=https://elmodels.ngrok.app/v1/chat/completions
👥 الفريق
مشروع دراية — ThakаThon EDU-027
