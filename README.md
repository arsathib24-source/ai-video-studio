# AI Video Creation Studio (AI ভিডিও স্টুডিও)

একটি অল-ইন-ওয়ান AI ভিডিও জেনারেশন প্ল্যাটফর্ম যা Text-to-Video, Image-to-Video, স্বয়ংক্রিয় সোশ্যাল মিডিয়া রিল/শর্টস (Faceless ও Avatar) এবং রিয়েল হিউম্যান ভয়েস তৈরি করে।

---

## 🌟 মূল ফিচারসমূহ (Core Features)

1. **🎬 Text-to-Video Studio:**
   - যেকোনো প্রম্পট থেকে সরাসরি সিনেমাটিক ভিডিও জেনারেশন।
   - Gemini AI দিয়ে প্রম্পট অটো-এনহ্যান্স করার সুবিধা।
   - Minimax Hailuo, Kling 1.5, Luma Dream Machine, ও CogVideoX সাপোর্ট।
   - 16:9 (YouTube), 9:16 (Shorts/TikTok), ও 1:1 রেশিও।

2. **📸 Image-to-Video Animator:**
   - আপনার নিজস্ব ছবি (Photo/Artwork) আপলোড করে সেটিকে জীবন্ত ভিডিওতে রূপান্তর।
   - স্মুথ ক্যামেরা মোশন, ওয়াটার ফ্লো, জুম ও প্যান এফেক্ট।

3. **📱 Automated Faceless Shorts & Reels Engine:**
   - একটি টপিক দিলে **Gemini API** অটোমেটিক ভাইরাল হুক ও প্রতিটি দৃশ্যের স্ক্রিপ্ট লিখে দেয়।
   - **রিয়েল হিউম্যান ভয়েস (Real Human Voice):** বাংলা (Pradeep, Nabanita, Bashkar, Tanishaa) এবং ইংরেজি (Christopher, Jenny, Guy) সহ প্রাকৃতিক মানুষের কণ্ঠ।
   - **Node.js & FFmpeg Pipeline:** স্বয়ংক্রিয়ভাবে অডিও এবং ভিজ্যুয়াল মার্জ করে রেডি-টু-পোস্ট ৯:১৬ ভার্টিক্যাল ভিডিও রেন্ডার।

4. **🗣️ Real Human Talking Avatar Studio:**
   - রিয়েল মানুষের মুখের ছবি ও কণ্ঠের সাথে পারফেক্ট লিপ-সিঙ্ক (Lip-sync) ভিডিও জেনারেশন।
   - টেক্সট লিখে কথা বলানো অথবা নিজস্ব অডিও ভয়েস রেকর্ড আপলোড করার সুবিধা।

5. **⚙️ ইন-অ্যাপ API Keys সেটিংস:**
   - ড্যাশবোর্ডের সেটিংস প্যানেল থেকে সরাসরি আপনার **Google Gemini API Key** (ফ্রি) ও **Fal.ai Key** / **Replicate Token** কনফিগার করার সুবিধা।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

- **Frontend & UI:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend:** Node.js API Routes (Next.js server runtime)
- **Video Processing:** `FFmpeg` (`@ffmpeg-installer/ffmpeg`, `fluent-ffmpeg`)
- **AI Integrations:**
  - **Google Gemini API** (`@google/generative-ai`): ভাইরাল স্ক্রিপ্টিং ও প্রম্পট এনহ্যান্সমেন্ট
  - **Fal.ai & Replicate:** Minimax Hailuo, Kling 1.5, Luma Dream Machine, SVD, LatentSync
  - **Neural Voice Engine:** অতি-বাস্তবসম্মত প্রাকৃতিক বাংলা ও ইংরেজি কণ্ঠ

---

## 🚀 কীভাবে চালু করবেন (Quick Start)

### ১. ডিপেনডেন্সি ইনস্টল (ইতিমধ্যে সম্পন্ন):
```bash
npm install
```

### ২. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

### ৩. API Keys কনফিগারেশন:
ওয়েব ইন্টারফেসের উপরের ডানদিকের **"API Keys"** বাটনে ক্লিক করুন অথবা `.env.local` ফাইলে যুক্ত করুন:
- **Gemini API Key (সম্পূর্ণ ফ্রি):** [Google AI Studio](https://aistudio.google.com/app/apikey) থেকে ১ মিনিটে ফ্রিতে নিতে পারবেন।
- **Fal.ai API Key (ভিডিও তৈরির জন্য):** [Fal.ai Keys](https://fal.ai/dashboard/keys)
