
// VR trenajyor progress ma'lumotlarini saqlash

function saveProgress(data) {
    localStorage.setItem(
        "vr-trainer-progress",
        JSON.stringify(data)
    );
}

function loadProgress() {
    const data = localStorage.getItem("vr-trainer-progress");

    if (data) {
        return JSON.parse(data);
    }

    return null;
}
