// Data pertanyaan: setiap objek berisi teks dan kategori love language
const questions = [
    // Words of Affirmation (3 soal)
    { text: "Saya merasa sangat dicintai saat pasangan mengatakan 'Aku sayang kamu'.", category: "words" },
    { text: "Pujian dari pasangan membuat hari saya menjadi lebih baik.", category: "words" },
    { text: "Saya suka ketika pasangan memberi semangat lewat kata-kata.", category: "words" },

    // Acts of Service (3 soal)
    { text: "Saya merasa dihargai saat pasangan membantu pekerjaan rumah tanpa diminta.", category: "acts" },
    { text: "Lebih berarti bagi saya jika pasangan melakukan sesuatu untuk saya daripada sekadar berkata-kata.", category: "acts" },
    { text: "Saya senang ketika pasangan menyiapkan sarapan untuk saya.", category: "acts" },

    // Receiving Gifts (3 soal)
    { text: "Hadiah kecil dari pasangan selalu membuat saya tersenyum.", category: "gifts" },
    { text: "Saya suka memberikan kejutan berupa hadiah kepada pasangan.", category: "gifts" },
    { text: "Saya menyimpan kenang-kenangan dari pasangan dengan baik.", category: "gifts" },

    // Quality Time (3 soal)
    { text: "Saya menikmati waktu berdua dengan pasangan tanpa gangguan HP atau TV.", category: "time" },
    { text: "Bagi saya, perhatian penuh pasangan saat bersama adalah hal penting.", category: "time" },
    { text: "Saya merasa dekat dengan pasangan saat kami melakukan hobi bersama.", category: "time" },

    // Physical Touch (3 soal)
    { text: "Sentuhan fisik seperti pelukan atau genggaman tangan membuat saya merasa aman.", category: "touch" },
    { text: "Saya suka duduk dekat atau bersandar pada pasangan.", category: "touch" },
    { text: "Ciuman dari pasangan adalah ekspresi cinta yang paling tulus.", category: "touch" }
];

// Nama kategori untuk tampilan
const categoryNames = {
    words: "Words of Affirmation (Kata-kata Penegasan)",
    acts: "Acts of Service (Tindakan Pelayanan)",
    gifts: "Receiving Gifts (Menerima Hadiah)",
    time: "Quality Time (Waktu Berkualitas)",
    touch: "Physical Touch (Sentuhan Fisik)"
};

// Acak urutan pertanyaan agar tidak membosankan
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

let shuffledQuestions = shuffleArray([...questions]);

// State kuis
let currentIndex = 0;
let answers = new Array(shuffledQuestions.length).fill(null); // null berarti belum dijawab

// Elemen DOM
const questionNumberSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const questionTextDiv = document.getElementById('question-text');
const radioButtons = document.querySelectorAll('input[name="answer"]');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz-container');
const questionCard = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const primaryLanguageDiv = document.getElementById('primary-language');
const scoresDiv = document.getElementById('scores');
const chartDiv = document.getElementById('chart');
const restartBtn = document.getElementById('restart-btn');

totalQuestionsSpan.textContent = shuffledQuestions.length;

// Fungsi untuk menampilkan pertanyaan berdasarkan currentIndex
function renderQuestion() {
    const q = shuffledQuestions[currentIndex];
    questionTextDiv.textContent = q.text;
    questionNumberSpan.textContent = currentIndex + 1;

    // Set radio button berdasarkan jawaban yang sudah dipilih (jika ada)
    const savedAnswer = answers[currentIndex];
    radioButtons.forEach(radio => {
        radio.checked = (radio.value == savedAnswer);
    });

    // Atur tombol prev/next
    prevBtn.disabled = currentIndex === 0;
    // Tombol next disable jika belum menjawab, tapi kita izinkan pindah dengan syarat sudah menjawab? 
    // Untuk user experience, lebih baik tidak disable next, tapi jika belum menjawab, next akan menyimpan null? 
    // Kita akan atur: next bisa diklik meski belum jawab, tapi jawaban akan tetap null. 
    // Tapi jika null, nanti dihitung 0. 
    // Atau kita paksa harus memilih? Kita pilih: harus memilih agar tidak ada data kosong.
    // Jadi next disabled jika belum memilih jawaban.
    nextBtn.disabled = answers[currentIndex] === null;
}

// Simpan jawaban saat memilih radio
radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        answers[currentIndex] = value;
        // Aktifkan tombol next
        nextBtn.disabled = false;
    });
});

// Tombol sebelumnya
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
});

// Tombol selanjutnya
nextBtn.addEventListener('click', () => {
    if (currentIndex < shuffledQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        // Ini pertanyaan terakhir, tampilkan hasil
        showResult();
    }
});

// Fungsi menghitung skor per kategori
function calculateScores() {
    const scores = {
        words: 0,
        acts: 0,
        gifts: 0,
        time: 0,
        touch: 0
    };

    for (let i = 0; i < shuffledQuestions.length; i++) {
        const cat = shuffledQuestions[i].category;
        const ans = answers[i];
        if (ans !== null) {
            scores[cat] += ans;
        }
        // Jika null (tidak dijawab), tidak ditambahkan
    }

    return scores;
}

// Menentukan bahasa cinta utama (skor tertinggi)
function getPrimaryLanguage(scores) {
    let maxCat = null;
    let maxScore = -1;
    for (let cat in scores) {
        if (scores[cat] > maxScore) {
            maxScore = scores[cat];
            maxCat = cat;
        }
    }
    return { category: maxCat, score: maxScore };
}

// Tampilkan hasil
function showResult() {
    // Sembunyikan card pertanyaan, tampilkan hasil
    questionCard.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const scores = calculateScores();
    const primary = getPrimaryLanguage(scores);

    // Tampilkan bahasa utama
    primaryLanguageDiv.innerHTML = `${categoryNames[primary.category]} <br> <span style="font-size:1.2rem;">(Skor: ${primary.score})</span>`;

    // Tampilkan semua skor dalam bentuk teks
    let scoresHtml = '<h3>Skor Lengkap:</h3>';
    for (let cat in scores) {
        scoresHtml += `<p><strong>${categoryNames[cat]}:</strong> ${scores[cat]}</p>`;
    }
    scoresDiv.innerHTML = scoresHtml;

    // Tampilkan diagram batang
    chartDiv.innerHTML = '';
    for (let cat in scores) {
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar';

        const label = document.createElement('span');
        label.className = 'chart-label';
        // Ambil singkatan atau nama pendek
        let shortName = '';
        if (cat === 'words') shortName = 'Words';
        else if (cat === 'acts') shortName = 'Acts';
        else if (cat === 'gifts') shortName = 'Gifts';
        else if (cat === 'time') shortName = 'Time';
        else if (cat === 'touch') shortName = 'Touch';
        label.textContent = shortName;

        const barDiv = document.createElement('div');
        barDiv.className = 'bar-container';

        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        // Maksimum skor per kategori: 3 soal * 5 = 15
        const maxPossible = 15;
        const percentage = (scores[cat] / maxPossible) * 100;
        fill.style.width = percentage + '%';

        barDiv.appendChild(fill);

        const valueSpan = document.createElement('span');
        valueSpan.className = 'chart-value';
        valueSpan.textContent = scores[cat];

        barContainer.appendChild(label);
        barContainer.appendChild(barDiv);
        barContainer.appendChild(valueSpan);

        chartDiv.appendChild(barContainer);
    }
}

// Tombol ulangi kuis
restartBtn.addEventListener('click', () => {
    // Acak ulang pertanyaan
    shuffledQuestions = shuffleArray([...questions]);
    currentIndex = 0;
    answers = new Array(shuffledQuestions.length).fill(null);
    totalQuestionsSpan.textContent = shuffledQuestions.length;

    // Tampilkan kembali card pertanyaan
    questionCard.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    renderQuestion();
});

// Inisialisasi pertama
renderQuestion();

// Pastikan jika user mengklik next tanpa memilih, tidak bisa
// Sudah diatur disabled
