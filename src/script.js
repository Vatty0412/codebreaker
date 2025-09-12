let attempts = 8;

const generateRandomSequence = (k) => {
    const digits = Array.from({length: 10}, (_, i) => i);
    const sequence = [];

    for(let i = 0; i < k; i++){
        const randomIdx = Math.floor(digits.length * Math.random());
        sequence.push(digits[randomIdx]);
        digits.splice(randomIdx, 1);
    }

    return sequence;
}

const genSequence = generateRandomSequence(6);

const form = document.getElementsByTagName("form")[0];

form.addEventListener("input", e => {
    const target = e.target;
    const val = target.value;

    if (isNaN(val)) {
        target.value = "";
        return;
    }

    if (val != "") {
        const next = target.nextElementSibling;
        if (next) {
            next.focus();
        }
    }
});

form.addEventListener("keydown", e => {
    if (e.key.toLowerCase() == "backspace") {
        e.preventDefault();
        if(e.target.value == "") e.target.previousElementSibling?.focus();
        else e.target.value = "";
    }
});

const lose_message = `<div class="result lose-message">
<b>Mission compromised, Agent.</b>
<span>The code remains locked, and enemy systems have detected your presence. Your cover is blown.</span>
<span>Headquarters advises immediate extraction. Regroup, recalibrate… and prepare to try again. The mission isn't over — the world still needs you.</span>
</div>`

const win_message = `<div class="result win-message">
<b>Outstanding work, Agent.</b>
<span>The enemy's defenses are down, and the 6-digit code is yours. Precision, logic, and nerves of steel — you've proven yourself a true Codebreaker operative.</span>
<span>Headquarters salutes you. Until the next mission… stay sharp, Agent.</span>
</div>`

form.addEventListener('submit', e => {
    e.preventDefault();
    let flag = false;
    const userResponse = [];

    Array.from(form.children).slice(0, 6).forEach(input => {
        if(input.value == "") {
            flag = true;
            return;
        }
        userResponse.push(Number.parseInt(input.value));
        input.value = "";
    });
    form.children[0].focus();
    if(flag) return;

    const div = document.createElement("div")
    div.classList.add("response");
    attempts--;
    document.getElementById("attempts").innerText = `Attempts left: ${attempts}`;
    let ansCorrect = true;
    userResponse.forEach((val, idx) => {
        let clr = "#f87171";
        if(val === genSequence[idx]) clr = "#34d399";
        else{
            ansCorrect = false;
            if(genSequence.includes(val)) clr = "#fbbf24";
        }

        const span = document.createElement("span");
        span.innerText = val;
        span.style.color = clr;
        span.style.textShadow = `0 0 12px ${clr + '8f'}`;
        div.appendChild(span);
    });
    if(ansCorrect) {
        Array.from(form.children).slice(0, 6).forEach(input => input.readOnly = true);
        document.getElementById("responses").insertAdjacentHTML('afterend', win_message)
    } else if (attempts == 0) {
        Array.from(form.children).slice(0, 6).forEach(input => input.readOnly = true);
        document.getElementById("responses").insertAdjacentHTML('afterend', lose_message)
    }
    document.getElementById("responses").appendChild(div);
    form.children[5].blur();
})