const canvas = document.getElementById("ksCanvas");
canvas.width = 600;
canvas.height = 480;
const ctx = canvas.getContext("2d");
const omegaSlider = document.getElementById("omegaSlider");
const omegaValue = document.getElementById("omegaValue");
const rSlider = document.getElementById("rSlider");
const rValue = document.getElementById("rValue");
const alphaSlider = document.getElementById("alphaSlider");
const alphaValue = document.getElementById("alphaValue");
const KSlider = document.getElementById("KSlider");
const KValue = document.getElementById("KValue");
const nSlider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");
const phaseDiffCanvas = document.getElementById("phaseDiffCanvas");
phaseDiffCanvas.width = 400;
phaseDiffCanvas.height = 360;
const phaseDiffCtx = phaseDiffCanvas.getContext("2d");
const randomizePhasesButton = document.getElementById("randomizePhases");
const togglePhaseDiffButton = document.getElementById("togglePhaseDiff");

const dt = 0.1;

let N = parseInt(nSlider.value);
let r = parseFloat(rSlider.value);
let omega = parseFloat(omegaSlider.value);
let R = Math.round(N * r);
let alpha = parseFloat(alphaSlider.value);
let K = parseFloat(KSlider.value);
let phases = new Array(N);
let freqs = new Array(N);
let showPhaseDiff = false;

for (let i = 0; i < N; i++) {
    phases[i] = Math.random() * 2 * Math.PI;
    freqs[i] = omega;
}

nSlider.addEventListener("input", function () {
    N = parseInt(nSlider.value);
    nValue.textContent = N;

    // 重新分配phases和freqs数组
    phases = new Array(N);
    freqs = new Array(N);

    // 初始化phases和freqs数组
    for (let i = 0; i < N; i++) {
        phases[i] = Math.random() * 2 * Math.PI;
        freqs[i] = omega;
    }

    // 更新耦合距离R
    R = Math.round(N * r);
});

function updatePhases() {
    for (let i = 0; i < N; i++) {
        let sum = 0;
        for (let offset = -R; offset <= R; offset++) {
            let j = i + offset;
            let neighbor;
            if (j < 0) {
                neighbor = j + N;
            } else if (j >= N) {
                neighbor = j - N;
            } else {
                neighbor = j;
            }
            sum += Math.sin(phases[neighbor] - phases[i] + alpha);
        }
        // Include the coupling term by adding the sum term directly to the phase change
        phases[i] += dt * (freqs[i] + (K / (2 * R)) * sum);
        phases[i] = (phases[i] + 2 * Math.PI) % (2 * Math.PI);
    }
}

function drawPhases() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw x-axis and y-axis
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 50, canvas.height - 50);
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50, 50);
    ctx.stroke();

    // Draw x-axis label
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Position", canvas.width / 2, canvas.height - 10);

    // Draw y-axis label
    ctx.save();
    ctx.translate(10, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Phase", 0, 0);
    ctx.restore();

    // Draw x-axis tics
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    for (let i = 0; i <= 100; i += 10) {
        ctx.moveTo(50 + i * (canvas.width - 100) / 100, canvas.height - 50);
        ctx.lineTo(50 + i * (canvas.width - 100) / 100, canvas.height - 45);
        ctx.fillText(i, 50 + i * (canvas.width - 100) / 100, canvas.height - 30);
    }
    
    // Draw y-axis tics
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 10; i++) {
        ctx.moveTo(50, canvas.height - 50 - i * (canvas.height - 100) / 10);
        ctx.lineTo(55, canvas.height - 50 - i * (canvas.height - 100) / 10);
        ctx.fillText((2 * Math.PI * i / 10).toFixed(1), 45, canvas.height - 50 - i * (canvas.height - 100) / 10);
    }
    ctx.stroke();
    
    // Draw oscillators
    for (let i = 0; i < N; i++) {
        let x = 50 + i * (canvas.width - 100) / N;
        let y = canvas.height - 50 - (canvas.height - 100) * phases[i] / (2 * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawPhaseDifferences() {
    phaseDiffCtx.clearRect(0, 0, phaseDiffCanvas.width, phaseDiffCanvas.height);

    // Draw x-axis and y-axis
    phaseDiffCtx.beginPath();
    phaseDiffCtx.moveTo(50, phaseDiffCanvas.height - 50);
    phaseDiffCtx.lineTo(phaseDiffCanvas.width - 50, phaseDiffCanvas.height - 50);
    phaseDiffCtx.moveTo(50, phaseDiffCanvas.height - 50);
    phaseDiffCtx.lineTo(50, 50);
    phaseDiffCtx.stroke();

    // Draw x-axis label
    phaseDiffCtx.font = "bold 16px Arial";
    phaseDiffCtx.fillStyle = "black";
    phaseDiffCtx.textAlign = "center";
    phaseDiffCtx.fillText("Position", phaseDiffCanvas.width / 2, phaseDiffCanvas.height - 10);

    // Draw y-axis label
    phaseDiffCtx.save();
    phaseDiffCtx.translate(10, phaseDiffCanvas.height / 2);
    phaseDiffCtx.rotate(-Math.PI / 2);
    phaseDiffCtx.font = "bold 16px Arial";
    phaseDiffCtx.fillStyle = "black";
    phaseDiffCtx.textAlign = "center";
    phaseDiffCtx.fillText("Phase Difference", 0, 0);
    phaseDiffCtx.restore();

    // Draw x-axis tics
    phaseDiffCtx.font = "12px Arial";
    phaseDiffCtx.textAlign = "center";
    for (let i = 0; i <= N - 1; i += Math.round((N - 1) / 10)) {
        phaseDiffCtx.moveTo(50 + i * (phaseDiffCanvas.width - 100) / (N - 1), phaseDiffCanvas.height - 50);
        phaseDiffCtx.lineTo(50 + i * (phaseDiffCanvas.width - 100) / (N - 1), phaseDiffCanvas.height - 45);
        phaseDiffCtx.fillText(i, 50 + i * (phaseDiffCanvas.width - 100) / (N - 1), phaseDiffCanvas.height - 30);
    }
    
    // Draw y-axis tics
    phaseDiffCtx.textAlign = "right";
    phaseDiffCtx.textBaseline = "middle";
    for (let i = 0; i <= 10; i++) {
        phaseDiffCtx.moveTo(50, phaseDiffCanvas.height - 50 - i * (phaseDiffCanvas.height - 100) / 10);
        phaseDiffCtx.lineTo(55, phaseDiffCanvas.height - 50 - i * (phaseDiffCanvas.height - 100) / 10);
        phaseDiffCtx.fillText((2 * Math.PI * i / 10).toFixed(1), 45, phaseDiffCanvas.height - 50 - i * (phaseDiffCanvas.height - 100) / 10);
    }
    phaseDiffCtx.stroke();

    for (let i = 0; i < N - 1; i++) {
        let phaseDiff = phases[i + 1] - phases[i];
        if (phaseDiff < 0) {
            phaseDiff += 2 * Math.PI;
        }

        let x = i * (phaseDiffCanvas.width - 100) / (N - 1) + 50;
        let y = phaseDiffCanvas.height - 50 - (phaseDiffCanvas.height - 100) * phaseDiff / (2 * Math.PI);

        phaseDiffCtx.beginPath();
        phaseDiffCtx.arc(x, y, 2, 0, 2 * Math.PI);
        phaseDiffCtx.fill();
    }
}


function animationLoop() {
    updatePhases();
    drawPhases();
    if (showPhaseDiff) {
        drawPhaseDifferences();
    }
    requestAnimationFrame(animationLoop);
}


rSlider.addEventListener("input", function () {
    r = parseFloat(rSlider.value);
    rValue.textContent = r.toFixed(2);

    // 更新耦合距离R
    R = Math.round(N * r);
});

KSlider.addEventListener("input", function() {
    K = parseFloat(KSlider.value);
    KValue.textContent = K.toFixed(1);
});

omegaSlider.addEventListener("input", function() {
    omega = parseFloat(omegaSlider.value);
    omegaValue.textContent = omega.toFixed(1);
    for (let i = 0; i < N; i++) {
        freqs[i] = omega;
    }
});

alphaSlider.addEventListener("input", function() {
    alpha = parseFloat(alphaSlider.value) * Math.PI;
    alphaValue.textContent = (alpha / Math.PI).toFixed(2);
});

togglePhaseDiffButton.addEventListener("click", function () {
    showPhaseDiff = !showPhaseDiff;
    if (showPhaseDiff) {
        drawPhaseDifferences();
    } else {
        phaseDiffCtx.clearRect(0, 0, phaseDiffCanvas.width, phaseDiffCanvas.height);
    }
});

randomizePhasesButton.addEventListener("click", function() {
    for (let i = 0; i < N; i++) {
        phases[i] = Math.random() * 2 * Math.PI;
    }
});

animationLoop();
