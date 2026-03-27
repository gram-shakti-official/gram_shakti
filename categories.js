<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Gram Shakti - Home</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Devanagari', sans-serif; background-color: #f8fafc; }
        .category-card:active { transform: scale(0.92); }
        .gradient-bg { background: linear-gradient(135deg, #059669 0%, #065f46 100%); }
        /* पॉपअप एनीमेशन */
        #subCatModal { transition: bottom 0.3s ease-in-out; }
    </style>
</head>
<body class="pb-24">

    <div class="gradient-bg text-white p-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-50">
        <h1 class="text-xl font-bold italic mb-4">GRAM SHAKTI</h1>
        <div class="bg-white rounded-2xl p-3 flex items-center shadow-inner">
            <span class="text-emerald-600 mr-2 text-xl">📍</span>
            <div class="flex-1">
                <input type="number" id="pinInput" maxlength="6" class="w-full bg-transparent text-gray-800 font-bold outline-none text-sm" placeholder="पिन कोड डालें">
                <p id="locationText" class="text-[10px] text-gray-400 font-bold uppercase">अपनी लोकेशन सेट करें</p>
            </div>
        </div>
    </div>

    <div class="p-4 mt-4">
        <h2 class="text-gray-800 font-bold text-lg mb-4 border-l-4 border-emerald-500 pl-2">सभी सेवाएं</h2>
        <div id="categoryGrid" class="grid grid-cols-3 gap-3"></div>
    </div>

    <div id="subCatModal" class="fixed -bottom-full left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.2)] z-[60] p-6 max-h-[70vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
            <h3 id="modalTitle" class="text-emerald-700 font-bold text-lg">उप-श्रेणी चुनें</h3>
            <button onclick="closeSubCat()" class="text-gray-400 text-2xl font-bold">&times;</button>
        </div>
        <div id="subCatList" class="space-y-2">
            </div>
    </div>
    <div id="overlay" onclick="closeSubCat()" class="fixed inset-0 bg-black/40 hidden z-[55]"></div>

    <script>
// 15 मुख्य कैटेगरी और उनके अंदर की सब-कैटेगरी का डेटा
const serviceData = {
    "मिस्त्री": ["बिजली मिस्त्री", "नल मिस्त्री", "राजमिस्त्री", "बढ़ई", "लोहार", "पेंटर", "बाइक मैकेनिक", "कार मैकेनिक", "ट्रैक्टर मिस्त्री"],
    "खेती": ["खेत मजदूर", "JCB ऑपरेटर", "ट्रैक्टर ड्राइवर", "हार्वेस्टर ऑपरेटर", "माली", "डेयरी सर्विस", "खाद-बीज भंडार"],
    "गाड़ी": ["टैक्सी ड्राइवर", "बस/ट्रक ड्राइवर", "ऑटो ड्राइवर", "पिकअप लोडिंग", "एम्बुलेंस सेवा", "टूर एंड ट्रेवल्स"],
    "दुकान": ["किराना स्टोर", "मेडिकल स्टोर", "मोबाइल शॉप", "कपड़े की दुकान", "हार्डवेयर स्टोर", "बर्तन दुकान", "ज्वैलरी"],
    "फंक्शन": ["हलवाई/कुक", "टेंट हाउस", "डीजे/साउंड", "फोटोग्राफर", "ब्यूटी पार्लर", "मेहंदी आर्टिस्ट"],
    "डिजिटल": ["ई-मित्र/CSC", "साइबर कैफे", "बैंकिंग एजेंट", "बीमा एजेंट", "वकील", "प्रॉपर्टी डीलर"],
    "घरेलू": ["दर्जी", "नाई/सैलून", "धोबी/प्रेस", "ट्यूशन टीचर", "सफाई कर्मचारी", "गार्ड", "आटा चक्की"],
    "स्वास्थ्य": ["प्राइवेट डॉक्टर", "नर्स/ANM", "कंपाउंडर", "लैब टेस्ट", "आयुर्वेद"],
    "शिक्षा": ["कोचिंग सेंटर", "कंप्यूटर क्लास", "ड्राइविंग स्कूल"],
    "निर्माण": ["बिल्डिंग ठेकेदार", "रोड निर्माण", "टाइल मिस्त्री", "POP वर्क"],
    "पशुपालन": ["मुर्गी पालन", "मछली पालन", "बकरी पालन", "मधुमक्खी पालन"],
    "पानी": ["पानी टैंकर", "सेप्टिक टैंक सफाई", "कूड़ा गाड़ी"],
    "किराया": ["JCB किराया", "ट्रैक्टर किराया", "शादी सामान किराया", "जनरेटर किराया"],
    "होटल": ["ढाबा/रेस्टोरेंट", "चाय दुकान", "मिठाई दुकान", "लॉज"],
    "रोजगार": ["दिहाड़ी मजदूर", "लोडिंग/अनलोडिंग", "अस्थायी खेत काम"]
};

const mainCategories = [
    { name: "मिस्त्री", icon: "🛠️", color: "bg-blue-50" },
    { name: "खेती", icon: "🚜", color: "bg-emerald-50" },
    { name: "गाड़ी", icon: "🚚", color: "bg-orange-50" },
    { name: "दुकान", icon: "🏪", color: "bg-purple-50" },
    { name: "फंक्शन", icon: "🎉", color: "bg-pink-50" },
    { name: "डिजिटल", icon: "💻", color: "bg-cyan-50" },
    { name: "घरेलू", icon: "🏠", color: "bg-indigo-50" },
    { name: "स्वास्थ्य", icon: "🏥", color: "bg-red-50" },
    { name: "शिक्षा", icon: "🎓", color: "bg-amber-50" },
    { name: "निर्माण", icon: "🏗️", color: "bg-slate-100" },
    { name: "पशुपालन", icon: "🐄", color: "bg-lime-50" },
    { name: "पानी", icon: "🚰", color: "bg-sky-50" },
    { name: "किराया", icon: "🔑", color: "bg-rose-50" },
    { name: "होटल", icon: "☕", color: "bg-yellow-50" },
    { name: "रोजगार", icon: "💼", color: "bg-teal-50" }
];

function init() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = mainCategories.map(cat => `
        <div class="category-card ${cat.color} p-4 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-sm border border-white transition-all cursor-pointer" 
             onclick="showSubCat('${cat.name}')">
            <span class="text-3xl mb-1">${cat.icon}</span>
            <p class="text-[11px] font-bold text-gray-700">${cat.name}</p>
        </div>
    `).join('');
}

function showSubCat(mainCat) {
    const list = serviceData[mainCat];
    const modal = document.getElementById('subCatModal');
    const overlay = document.getElementById('overlay');
    const subList = document.getElementById('subCatList');
    
    document.getElementById('modalTitle').innerText = `${mainCat} के काम चुनें`;
    
    subList.innerHTML = list.map(sub => `
        <div class="p-4 border-b border-gray-100 hover:bg-emerald-50 font-bold text-gray-700 flex justify-between items-center cursor-pointer" 
             onclick="selectSub('${sub}')">
            ${sub} <span class="text-emerald-500">→</span>
        </div>
    `).join('');

    modal.style.bottom = "0";
    overlay.classList.remove('hidden');
}

function closeSubCat() {
    document.getElementById('subCatModal').style.bottom = "-100%";
    document.getElementById('overlay').classList.add('hidden');
}

function selectSub(sub) {
    const pin = document.getElementById('pinInput').value;
    if(!pin || pin.length < 6) {
        alert("पहले अपना 6 अंकों का सही पिन कोड डालें!");
        return;
    }
    alert(`${sub} के वर्कर पिन कोड ${pin} में खोजे जा रहे हैं...`);
    closeSubCat();
}

init();
</script>
</body>
</html>
