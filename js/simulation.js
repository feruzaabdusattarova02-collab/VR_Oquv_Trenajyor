
let currentStep = 1;
let errors = 0;
let startTime = Date.now();
let elapsedSeconds = 0;
let timerInterval;

const steps = {
    1: "Himoya vositalarini tekshiring",
    2: "Elektr simlarini tekshiring",
    3: "Kompyuterni ishga tushiring",
    4: "Kompyuterni xavfsiz o‘chiring"
};

// Xabar chiqarish
function showMessage(message, color = "yellow") {
    const element = document.getElementById("message");
    element.innerText = message;
    element.style.color = color;
}

// Interfeysni yangilash
function updateInterface() {
    document.getElementById("step").innerText =
        currentStep <= 4
            ? currentStep + "-bosqich: " + steps[currentStep]
            : "Trenajyor yakunlandi!";

    document.getElementById("progress").innerText =
        "Bajarilgan: " + Math.min(currentStep - 1, 4) + " / 4";

    document.getElementById("errors").innerText =
        "Xatolar: " + errors;
}

// Natijani saqlash
function saveResult() {
    const result = {
        completed: Math.min(currentStep - 1, 4),
        errors: errors,
        time: elapsedSeconds
    };

    saveProgress(result);
}

// Vaqt hisoblagichi
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor(
            (Date.now() - startTime) / 1000
        );

        document.getElementById("timer").innerText =
            "Vaqt: " + elapsedSeconds + " soniya";
    }, 1000);
}

// Obyektlarni tekshirish
function handleObjectClick(id) {
    if (currentStep > 4) return;

    const expectedId = "step" + currentStep;

    if (id === expectedId) {
        showMessage("Ajoyib! To‘g‘ri harakat.", "#00ff66");

        const object = document.getElementById(id);
        object.setAttribute("color", "#00ff00");

        currentStep++;

        updateInterface();

        if (currentStep > 4) {
            finishSimulation();
        } else {
            saveResult();
        }
    } else {
        errors++;

        showMessage(
            "Noto‘g‘ri harakat! Avval " +
            steps[currentStep] + ".",
            "red"
        );

        updateInterface();
        saveResult();
    }
}

// Mashg‘ulotni yakunlash
function finishSimulation() {
    clearInterval(timerInterval);

    elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
    );

    saveResult();

    showMessage(
        "Tabriklaymiz! Barcha bosqichlar bajarildi!",
        "#00ff66"
    );

    document.getElementById("step").innerText =
        "Trenajyor muvaffaqiyatli yakunlandi!";

    document.getElementById("progress").innerText =
        "Bajarilgan: 4 / 4";

    // Yakuniy natijalar paneli
    document.getElementById("resultPanel").style.display = "block";

    document.getElementById("finalSteps").innerText =
        "Bajarilgan qadamlar: 4 / 4";

    document.getElementById("finalErrors").innerText =
        "Xatolar soni: " + errors;

    document.getElementById("finalTime").innerText =
        "Sarflangan vaqt: " + elapsedSeconds + " soniya";
}

// Qayta boshlash
function restartSimulation() {
    clearInterval(timerInterval);

    currentStep = 1;
    errors = 0;
    elapsedSeconds = 0;
    startTime = Date.now();

    // Natijalar panelini yashirish
    document.getElementById("resultPanel").style.display = "none";

    // Obyektlarning dastlabki ranglarini tiklash
    document.querySelectorAll(".clickable").forEach(obj => {
        const id = obj.id;

        if (id === "step1") obj.setAttribute("color", "#00cc66");
        if (id === "step2") obj.setAttribute("color", "#ff9900");
        if (id === "step3") obj.setAttribute("color", "blue");
        if (id === "step4") obj.setAttribute("color", "red");
    });

    document.getElementById("timer").innerText =
        "Vaqt: 0 soniya";

    updateInterface();
    showMessage("Yangi mashg‘ulot boshlandi!");

    saveResult();
    startTimer();
}

// Dastur ishga tushishi
document.addEventListener("DOMContentLoaded", function () {

    // Obyektlarga bosish hodisasini biriktirish
    document.querySelectorAll(".clickable").forEach(obj => {
        obj.addEventListener("click", function () {
            handleObjectClick(this.id);
        });
    });

    // Oldingi natijani tiklash
    const oldResult = loadProgress();

    if (oldResult) {
        currentStep = Math.min(
            5,
            Math.max(1, Number(oldResult.completed) + 1)
        );

        errors = Number(oldResult.errors) || 0;
        elapsedSeconds = Number(oldResult.time) || 0;

        // Bajarilgan obyektlarni yashil qilish
        for (let i = 1; i < currentStep; i++) {
            document.getElementById("step" + i)
                .setAttribute("color", "#00ff00");
        }

        startTime = Date.now() - elapsedSeconds * 1000;

        showMessage(
            "Oldingi natija tiklandi: " +
            Math.min(currentStep - 1, 4) + "/4 qadam."
        );
    }

    updateInterface();

    if (currentStep <= 4) {
        startTimer();
    } else {
        // Oldin tugatilgan mashg‘ulot natijasini ko‘rsatish
        document.getElementById("resultPanel").style.display = "block";

        document.getElementById("finalSteps").innerText =
            "Bajarilgan qadamlar: 4 / 4";

        document.getElementById("finalErrors").innerText =
            "Xatolar soni: " + errors;

        document.getElementById("finalTime").innerText =
            "Sarflangan vaqt: " + elapsedSeconds + " soniya";

        showMessage("Barcha bosqichlar bajarilgan!", "#00ff66");
    }
});
