
import { TranslationData, Trainer, Course, FAQItem } from './types';

export const TRANSLATIONS: Record<'en' | 'kh', TranslationData> = {
  en: {
    nav: {
      home: "Home",
      mini: "Mini Program",
      other: "Other Programs",
      online: "Online Courses",
      free: "Free Courses",
      community: "Community",
      about: "About",
      faq: "FAQ & Policy",
      contact: "Contact",
      register: "Register Now",
      signIn: "Sign In",
      signOut: "Sign Out",
      profile: "My Profile"
    },
    home: {
      heroTitle: "KLTURE.ACADEMY – Cambodia’s Leading Practical Marketing Training Platform",
      heroSubtitle: "Built for business owners, aspiring marketers, creators, freelancers, and students who want real skills that work in the Cambodian market.",
      ctaPrimary: "View MINI Programs",
      ctaSecondary: "Talk to Our Team",
      introTitle: "Fastest-Growing Modern Marketing Education",
      introText: "Unlike traditional theory-based classes, we teach hands-on strategies, real case studies, and step-by-step systems used by successful brands today.",
      focusTitle: "Main Focus 2025 – MINI",
      focusPrice: "$85 / Student",
      focusSeats: "Limited to 20 students per class",
      reasonsTitle: "Why Students Love Us",
      reasons: [
        "Fast, practical, hands-on learning",
        "Cambodian market-specific strategies",
        "Affordable pricing",
        "High-quality trainers",
        "Real results & case studies",
        "Certificates recognized by businesses",
        "Access a 30 minutes session with Mr.Zell",
        "Fun, modern environment"
      ],
      seeMore: "See more reasons"
    },
    mini: {
      pageTitle: "KLTURE.ACADEMY MINI – Main Program (2025)",
      intro: "Our strongest and most in-demand program. Designed for real-world results in just one day or two nights.",
      weekendTitle: "MINI — Weekend Full-Day Class",
      weekendSub: "Main Product #1",
      nightTitle: "MINI — Night Class",
      nightSub: "Main Product #2",
      learnTitle: "What You Will Learn",
      learnList: [
        "TikTok content creation",
        "How to go viral on Cambodian TikTok",
        "Social media marketing fundamentals",
        "Creative and trend-based content strategy",
        "Sales and closing techniques for business",
        "Marketing psychology",
        "Step-by-step templates and systems"
      ],
      receiveTitle: "What Every Student Receives",
      receiveList: [
        "Official Certificate",
        "Worksheets & templates",
        "Practical exercises",
        "Access to private Telegram support group"
      ],
      btnRegisterWeekend: "Register for Weekend MINI",
      btnRegisterNight: "Register for Night MINI",
      trainerSectionTitle: "Meet The Trainers",
      zellNote: "Note: Zell is no longer the main instructor inside the MINI program — he now acts as ambassador, strategist, and curriculum director."
    },
    other: {
      title: "Other Programs (Not Main Focus)",
      sTitle: "KLTURE.ACADEMY S",
      sDesc: "4 trainers (including Zell). 1 Full Day. $150 per student. Advanced strategies & deeper content.",
      vipTitle: "KLTURE.ACADEMY VIP",
      vipDesc: "7 Premium Trainers. 8 Half-day sessions (4 weekends). Designed for serious marketers and business owners.",
      note: "Note: Our main focus for 2025 is the MINI program, but S and VIP are still available upon request.",
      interest: "Inquire Interest"
    },
    online: {
      title: "Online Self-Paced Courses",
      bundleTitle: "Bundle Offer",
      bundleDesc: "Get all 3 courses for only $35",
      note: "Online courses are self-paced and designed for business owners, online sellers, marketers, and aspiring influencers.",
      btnEnroll: "Buy The Course"
    },
    free: {
      title: "Free Courses",
      subtitle: "Start learning today with our collection of free, high-value training videos.",
      enrollBtn: "Enroll for Free",
      watchBtn: "Watch Now",
      loginToEnroll: "Log in to enroll"
    },
    community: {
      title: "Our Community",
      subtitle: "Connect with other marketers, business owners, and creators in the KLTURE network.",
      follow: "Follow",
      unfollow: "Unfollow",
      members: "Member Since"
    },
    trainers: {
      title: "Our Trainers",
      subtitle: "Meet the industry experts who will guide you through your marketing journey.",
      addBtn: "Add Trainer",
      formName: "Trainer Name",
      formRole: "Role / Specialty",
      formImage: "Image URL",
      formDesc: "Detailed Description",
      delete: "Delete",
      managementTitle: "Trainer Management"
    },
    about: {
      title: "About KLTURE.ACADEMY",
      content: [
        "Founded by Zell (Samnang Yim), KLTURE.ACADEMY is Cambodia’s fastest-growing modern marketing education platform.",
        "We exist for business owners, aspiring marketers, creators, freelancers, and students who want practical skills that work immediately in the Cambodian market.",
        "Unlike traditional theory, we focus on hands-on strategies, real case studies, and step-by-step systems."
      ],
      mission: "Mission: Make real marketing skills accessible, affordable, and high-impact for Cambodia’s next generation.",
      visionTitle: "Future Vision (2025–2026)",
      visionList: [
        "Become Cambodia’s #1 accredited marketing training center",
        "Partner with 10+ schools and universities",
        "Expand to Battambang, Siem Reap, Sihanoukville",
        "Recruit more trainers",
        "Certified over a million marketers in Cambodia"
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      refundTitle: "Refund Policy (Updated)",
      refundPolicy: [
        "We do NOT officially offer refunds.",
        "Refunds are NOT available for change of mind, disliking content, or busy schedules.",
        "Exceptions are made only for emergencies (proof required) by contacting Zell directly."
      ],
      refundNote: "We strongly recommend students ask questions before paying.",
      refundContact: "Contact Zell directly"
    },
    contact: {
      title: "Register & Contact",
      priceLabel: "Price (MINI)",
      formName: "Full Name",
      formPhone: "Phone Number",
      formTelegram: "Telegram Username (Optional)",
      formEmail: "Email",
      formPassword: "Password",
      formProgram: "Choose Program",
      formDate: "Preferred Schedule",
      formMsg: "Questions / Message",
      btnSubmit: "Submit Registration",
      success: "Thank you! Our team will contact you via Telegram or phone shortly."
    },
    footer: {
      summary: "Cambodia’s most practical, affordable, and modern marketing school.",
      foundedBy: "Founded by Zell (Samnang Yim)."
    }
  },
  kh: {
    nav: {
      home: "ទំព័រដើម",
      mini: "កម្មវិធី MINI",
      other: "កម្មវិធីផ្សេងៗ",
      online: "វគ្គសិក្សាតាមអនឡាញ",
      free: "វគ្គសិក្សាហ្វ្រី",
      community: "សហគមន៍",
      about: "អំពីយើង",
      faq: "សំណួរ & គោលការណ៍",
      contact: "ទំនាក់ទំនង",
      register: "ចុះឈ្មោះ",
      signIn: "ចូលប្រើប្រាស់",
      signOut: "ចាកចេញ",
      profile: "គណនីរបស់ខ្ញុំ"
    },
    home: {
      heroTitle: "KLTURE.ACADEMY – វេទិកាបណ្តុះបណ្តាលទីផ្សារជាក់ស្តែងឈានមុខគេនៅកម្ពុជា",
      heroSubtitle: "បង្កើតឡើងសម្រាប់ម្ចាស់អាជីវកម្ម អ្នកទីផ្សារ អ្នកបង្កើតមាតិកា និងសិស្សនិស្សិតដែលចង់បានជំនាញពិតប្រាកដសម្រាប់ទីផ្សារកម្ពុជា។",
      ctaPrimary: "មើលកម្មវិធី MINI",
      ctaSecondary: "ជជែកជាមួយក្រុមការងារ",
      introTitle: "ការអប់រំផ្នែកទីផ្សារទំនើបដែលរីកចម្រើនលឿនបំផុត",
      introText: "ខុសពីការរៀនទ្រឹស្តីបែបបុរាណ យើងបង្រៀនយុទ្ធសាស្ត្រអនុវត្តផ្ទាល់ ករណីសិក្សាជាក់ស្តែង និងប្រព័ន្ធដែលប្រើប្រាស់ដោយម៉ាកយីហោជោគជ័យ។",
      focusTitle: "ការផ្តោតសំខាន់ឆ្នាំ ២០២៥ – MINI",
      focusPrice: "$៨៥ / សិស្ស",
      focusSeats: "កំណត់ត្រឹម ២០ នាក់ក្នុងមួយថ្នាក់",
      reasonsTitle: "ហេតុអ្វីសិស្សស្រលាញ់យើង",
      reasons: [
        "ការរៀនបែបអនុវត្តជាក់ស្តែង និងឆាប់រហ័ស",
        "យុទ្ធសាស្ត្រសម្រាប់ទីផ្សារកម្ពុជា",
        "តម្លៃសមរម្យ",
        "គ្រូបង្វឹកដែលមានគុណភាពខ្ពស់",
        "លទ្ធផលជាក់ស្តែង & ករណីសិក្សា",
        "វិញ្ញាបនបត្រដែលទទួលស្គាល់ដោយអាជីវកម្ម",
        "ទទួលបានការប្រឹក្សា ៣០ នាទីជាមួយ Mr.Zell",
        "បរិយាកាសរីករាយ និងទំនើប"
      ],
      seeMore: "មើលហេតុផលបន្ថែម"
    },
    mini: {
      pageTitle: "KLTURE.ACADEMY MINI – កម្មវិធីចម្បង (២០២៥)",
      intro: "កម្មវិធីដែលពេញនិយមបំផុតរបស់យើង។ រចនាឡើងដើម្បីទទួលបានលទ្ធផលជាក់ស្តែងក្នុងរយៈពេលមួយថ្ងៃ ឬពីរយប់។",
      weekendTitle: "MINI — ថ្នាក់ពេញមួយថ្ងៃ (ចុងសប្តាហ៍)",
      weekendSub: "ផលិតផលចម្បងទី ១",
      nightTitle: "MINI — ថ្នាក់ពេលយប់",
      nightSub: "ផលិតផលចម្បងទី ២",
      learnTitle: "អ្វីដែលអ្នកនឹងរៀន",
      learnList: [
        "ការបង្កើតមាតិកា TikTok",
        "របៀបធ្វើឱ្យវីដេអូផ្ទុះ (Viral) នៅកម្ពុជា",
        "មូលដ្ឋានគ្រឹះទីផ្សារបណ្តាញសង្គម",
        "យុទ្ធសាស្ត្រមាតិកាច្នៃប្រឌិត និងតាមនិន្នាការ",
        "បច្ចេកទេសលក់ និងបិទការលក់សម្រាប់អាជីវកម្ម",
        "ចិត្តវិទ្យាទីផ្សារ",
        "គំរូ និងប្រព័ន្ធដែលអ្នកអាចប្រើភ្លាមៗ"
      ],
      receiveTitle: "អ្វីដែលសិស្សនឹងទទួលបាន",
      receiveList: [
        "វិញ្ញាបនបត្រផ្លូវការ",
        "ឯកសារសិក្សា & គំរូការងារ",
        "លំហាត់អនុវត្តជាក់ស្តែង",
        "ការចូលក្នុងក្រុម Telegram សម្រាប់ជំនួយ"
      ],
      btnRegisterWeekend: "ចុះឈ្មោះសម្រាប់ថ្នាក់ចុងសប្តាហ៍",
      btnRegisterNight: "ចុះឈ្មោះសម្រាប់ថ្នាក់ពេលយប់",
      trainerSectionTitle: "ជួបជាមួយគ្រូបង្វឹក",
      zellNote: "សម្គាល់៖ Zell លែងជាគ្រូបង្រៀនផ្ទាល់ក្នុងកម្មវិធី MINI ទៀតហើយ — គាត់ដើរតួជាឯកអគ្គរដ្ឋទូត អ្នកយុទ្ធសាស្ត្រ និងនាយកកម្មវិធីសិក្សា។"
    },
    other: {
      title: "កម្មវិធីផ្សេងៗទៀត",
      sTitle: "KLTURE.ACADEMY S",
      sDesc: "គ្រូបង្វឹក ៤ នាក់ (រួមទាំង Zell)។ ១ ថ្ងៃពេញ។ $១៥០។ យុទ្ធសាស្ត្រកម្រិតខ្ពស់ & មាតិកាស៊ីជម្រៅ។",
      vipTitle: "KLTURE.ACADEMY VIP",
      vipDesc: "គ្រូបង្វឹកពិសេស ៧ នាក់។ ៨ វគ្គពាក់កណ្តាលថ្ងៃ (៤ ចុងសប្តាហ៍)។ សម្រាប់អ្នកទីផ្សារ និងម្ចាស់អាជីវកម្ម។",
      note: "សម្គាល់៖ ការផ្តោតសំខាន់របស់យើងសម្រាប់ឆ្នាំ ២០២៥ គឺកម្មវិធី MINI ប៉ុន្តែ S និង VIP នៅតែមានតាមការស្នើសុំ។",
      interest: "សាកសួរចំណាប់អារម្មណ៍"
    },
    online: {
      title: "វគ្គសិក្សាតាមអនឡាញ",
      bundleTitle: "ការផ្តល់ជូនពិសេស (Bundle)",
      bundleDesc: "ទទួលបានទាំង ៣ វគ្គក្នុងតម្លៃត្រឹមតែ $៣៥",
      note: "វគ្គសិក្សាអនឡាញគឺរៀនដោយខ្លួនឯង រចនាឡើងសម្រាប់ម្ចាស់អាជីវកម្ម អ្នកលក់អនឡាញ និងអ្នកទីផ្សារ។",
      btnEnroll: "ទិញវគ្គសិក្សា"
    },
    free: {
      title: "វគ្គសិក្សាហ្វ្រី",
      subtitle: "ចាប់ផ្តើមរៀនថ្ងៃនេះជាមួយវីដេអូហ្វឹកហ្វឺនដែលមានតម្លៃខ្ពស់របស់យើងដោយឥតគិតថ្លៃ។",
      enrollBtn: "ចុះឈ្មោះចូលរៀនហ្វ្រី",
      watchBtn: "មើលវីដេអូ",
      loginToEnroll: "ចូលប្រើប្រាស់ដើម្បីរៀន"
    },
    community: {
      title: "សហគមន៍របស់យើង",
      subtitle: "ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកទីផ្សារ ម្ចាស់អាជីវកម្ម និងអ្នកបង្កើតមាតិកាផ្សេងទៀតនៅក្នុងបណ្តាញ KLTURE ។",
      follow: "តាមដាន",
      unfollow: "ឈប់តាមដាន",
      members: "សមាជិកតាំងពី"
    },
    trainers: {
      title: "គ្រូបង្វឹករបស់យើង",
      subtitle: "ជួបជាមួយអ្នកជំនាញក្នុងវិស័យដែលនឹងណែនាំអ្នកក្នុងដំណើរទីផ្សាររបស់អ្នក។",
      addBtn: "បន្ថែមគ្រូបង្វឹក",
      formName: "ឈ្មោះគ្រូបង្វឹក",
      formRole: "តួនាទី / ជំនាញ",
      formImage: "តំណភ្ជាប់រូបភាព",
      formDesc: "ការពិពណ៌នាលម្អិត",
      delete: "លុប",
      managementTitle: "ការគ្រប់គ្រងគ្រូបង្វឹក"
    },
    about: {
      title: "អំពី KLTURE.ACADEMY",
      content: [
        "បង្កើតឡើងដោយ Zell (សំ ណាង), KLTURE.ACADEMY គឺជាវេទិកាបណ្តុះបណ្តាលទីផ្សារទំនើបដែលរីកចម្រើនលឿនបំផុតនៅកម្ពុជា។",
        "យើងបង្កើតឡើងសម្រាប់ម្ចាស់អាជីវកម្ម អ្នកទីផ្សារ អ្នកបង្កើតមាតិកា និងសិស្សដែលចង់បានជំនាញជាក់ស្តែងសម្រាប់ទីផ្សារកម្ពុជា។",
        "ខុសពីទ្រឹស្តី យើងផ្តោតលើយុទ្ធសាស្ត្រអនុវត្តផ្ទាល់ និងករណីសិក្សាជាក់ស្តែង។"
      ],
      mission: "បេសកកម្ម៖ ធ្វើឱ្យជំនាញទីផ្សារពិតប្រាកដមានភាពងាយស្រួល តម្លៃសមរម្យ និងមានប្រសិទ្ធភាពខ្ពស់សម្រាប់យុវជនកម្ពុជា។",
      visionTitle: "ចក្ខុវិស័យអនាគត (២០២៥–២០២៦)",
      visionList: [
        "ក្លាយជាមជ្ឈមណ្ឌលបណ្តុះបណ្តាលទីផ្សារលេខ ១ នៅកម្ពុជា",
        "ទទួលបានការទទួលស្គាល់ផ្លូវច្បាប់",
        "សហការជាមួយសាលារៀន និងសាកលវិទ្យាល័យជាង ១០",
        "ពង្រីកទៅបាត់ដំបង សៀមរាប ក្រុងព្រះសីហនុ",
        "ជ្រើសរើសគ្រូបង្វឹកបន្ថែម",
        "ផ្តល់វិញ្ញាបនបត្រជូនអ្នកទីផ្សារជាង ១ លាននាក់នៅកម្ពុជា"
      ]
    },
    faq: {
      title: "សំណួរដែលសួរញឹកញាប់",
      refundTitle: "គោលការណ៍សងប្រាក់វិញ (Updated)",
      refundPolicy: [
        "ជាផ្លូវការ យើងមិនមានគោលការណ៍សងប្រាក់វិញទេ។",
        "មិនមានការសងប្រាក់សម្រាប់ករណីប្តូរចិត្ត មិនចូលចិត្តមាតិកា ឬជាប់រវល់។",
        "ករណីលើកលែងមានតែសម្រាប់គ្រាអាសន្ន (ត្រូវការភស្តុតាង) ដោយទាក់ទង Zell ផ្ទាល់។"
      ],
      refundNote: "យើងសូមណែនាំឱ្យសិស្សសួរព័ត៌មានឱ្យច្បាស់មុនពេលបង់ប្រាក់។",
      refundContact: "ទាក់ទង Zell ផ្ទាល់"
    },
    contact: {
      title: "ចុះឈ្មោះ & ទំនាក់ទំនង",
      priceLabel: "តម្លៃ (MINI)",
      formName: "ឈ្មោះពេញ",
      formPhone: "លេខទូរស័ព្ទ",
      formTelegram: "ឈ្មោះ Telegram (មិនចាំបាច់)",
      formEmail: "អ៊ីមែល",
      formPassword: "ពាក្យសម្ងាត់",
      formProgram: "ជ្រើសរើសកម្មវិធី",
      formDate: "កាលវិភាគសិក្សា",
      formMsg: "សំណួរ / សារ",
      btnSubmit: "ដាក់ពាក្យចុះឈ្មោះ",
      success: "អរគុណ! ក្រុមការងាររបស់យើងនឹងទាក់ទងអ្នកតាមរយៈ Telegram ឬទូរស័ព្ទក្នុងពេលឆាប់ៗនេះ។"
    },
    footer: {
      summary: "សាលាទីផ្សារដែលអនុវត្តជាក់ស្តែង តម្លៃសមរម្យ និងទំនើបបំផុតនៅកម្ពុជា។",
      foundedBy: "បង្កើតឡើងដោយ Zell (សំ ណាង)។"
    }
  }
};

export const COURSES: Course[] = [
  { id: 'TCM01', title: 'TikTok Content Marketing', price: '$25', description: 'Self-paced TikTok content marketing fundamentals.' },
  { id: 'TAC01', title: 'TikTok Ads Course', price: '$25', description: 'How to run effective TikTok ads.' },
  { id: 'CAP01', title: 'CapCut: Zero to Pro', price: '$15', description: 'Full guide to editing with CapCut.' },
];

export const TRAINERS: Trainer[] = [
  { name: 'Sopheng', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/sopheng/200/200' },
  { name: 'Kimly', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/kimly/200/200' },
  { name: 'Visal', role: 'Creative Content & Trend Strategy', image: 'https://picsum.photos/seed/visal/200/200' },
  { name: 'Siengmeng', role: 'Sales, Closing & Business', image: 'https://picsum.photos/seed/siengmeng/200/200' },
];

export const FAQS: FAQItem[] = [
  { question: "Who is this for?", answer: "Business owners, marketers, freelancers, and students wanting real skills." },
  { question: "Do I need marketing experience?", answer: "No. We teach from fundamentals to advanced strategies." },
  { question: "What do I get after training?", answer: "A certificate, access to the community, and templates." }
];