function calculateCorrectWords(userInput, sampleText) {
	const userWords = userInput.trim().split(/\s+/);
	const sampleWords = sampleText.trim().split(/\s+/);
	let correct = 0;
	for (let i = 0; i < userWords.length && i < sampleWords.length; i++) {
		if (userWords[i] === sampleWords[i]) correct++;
	}
	return correct;
}

function displayWpm(wpm) {
	const wpmSpan = document.getElementById('resultWpm');
	if (wpmSpan) wpmSpan.textContent = wpm;
}
function displayLevel(level) {
	const levelSpan = document.getElementById('resultLevel');
	if (levelSpan) {
		// Capitalize first letter for display
		levelSpan.textContent = level.charAt(0).toUpperCase() + level.slice(1);
	}
}
// Typing test timer variables
let testStartTime = null;
let testEndTime = null;

function startTest() {
	testStartTime = performance.now();
	testEndTime = null;
	setButtonStates({start: true, stop: false});
	// Optionally clear previous time
	displayTestTime('-');
	// Clear and enable typing input
	const typingInput = document.getElementById('typingInput');
	if (typingInput) {
		typingInput.value = '';
		typingInput.disabled = false;
		typingInput.focus();
	}
	// Display current level
	const difficulty = document.getElementById('difficultySelect').value;
	displayLevel(difficulty);
}

function stopTest() {
	if (testStartTime === null) return;
	testEndTime = performance.now();
	setButtonStates({start: false, stop: true});
	const elapsed = (testEndTime - testStartTime) / 1000;
	displayTestTime(elapsed.toFixed(2));
	// Display current level (in case user changed it before stopping)
	const difficulty = document.getElementById('difficultySelect').value;
	displayLevel(difficulty);
	// Calculate and display WPM
	const typingInput = document.getElementById('typingInput');
	const sampleText = document.getElementById('sampleText').textContent;
	if (typingInput && sampleText) {
		const correctWords = calculateCorrectWords(typingInput.value, sampleText);
		const minutes = elapsed / 60;
		const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;
		displayWpm(wpm);
		typingInput.disabled = true;
	}
}

function setButtonStates({start, stop}) {
	const startBtn = document.getElementById('startTestBtn');
	const stopBtn = document.getElementById('stopTestBtn');
	if (startBtn) startBtn.disabled = start;
	if (stopBtn) stopBtn.disabled = stop;
}

function displayTestTime(timeStr) {
	const timeSpan = document.getElementById('resultTime');
	if (timeSpan) timeSpan.textContent = timeStr;
}

function resetTest() {
	testStartTime = null;
	testEndTime = null;
	setButtonStates({start: false, stop: true});
	displayTestTime('-');
	displayWpm('-');
	// Clear and disable typing input
	const typingInput = document.getElementById('typingInput');
	if (typingInput) {
		typingInput.value = '';
		typingInput.disabled = true;
	}
	// Clear level display
	displayLevel('-');
}
// Typing test sample texts by difficulty
const sampleTexts = {
	easy: [
		"The quick brown fox jumps over the lazy dog.",
		"Pack my box with five dozen liquor jugs.",
		"A wizard's job is to vex chumps quickly in fog."
	],
	medium: [
		"Sphinx of black quartz, judge my vow and quickly explain the result.",
		"The five boxing wizards jump quickly over the lazy dog in the park.",
		"How razorback-jumping frogs can level six piqued gymnasts!"
	],
	hard: [
		"Jinxed wizards pluck ivy from the big quilt, exposing hazy fog and jumping frogs.",
		"Crazy Fredericka bought many very exquisite opal jewels, dazzling in the sunlight.",
		"Sympathizing would fix Quaker objectives, jeopardizing six juicy pomegranates."
	]
};

function getRandomText(difficulty) {
	const texts = sampleTexts[difficulty] || sampleTexts.easy;
	return texts[Math.floor(Math.random() * texts.length)];
}

function updateSampleText() {
	const difficulty = document.getElementById('difficultySelect').value;
	const text = getRandomText(difficulty);
	document.getElementById('sampleText').textContent = text;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
	// Disable typing input by default
	const typingInput = document.getElementById('typingInput');
	if (typingInput) typingInput.disabled = true;

		// Stop test with Enter/Return key in typing input
		if (typingInput) {
			typingInput.addEventListener('keydown', function(e) {
				if ((e.key === 'Enter' || e.code === 'Enter') && !document.getElementById('stopTestBtn').disabled) {
					e.preventDefault();
					stopTest();
				}
			});
		}

		// Allow Space or Tab to start the test, unless focus is in typing input
		document.addEventListener('keydown', function(e) {
			const active = document.activeElement;
			if (active && active === typingInput) return;
			if ((e.code === 'Space' || e.code === 'Tab') && !document.getElementById('startTestBtn').disabled) {
				e.preventDefault();
				startTest();
			}
		});
	// Set initial level display
	displayLevel(document.getElementById('difficultySelect').value);
	const difficultySelect = document.getElementById('difficultySelect');
	if (difficultySelect) {
		difficultySelect.addEventListener('change', updateSampleText);
		// Set initial text
		updateSampleText();
	}
	// Optionally, you can also randomize on retry
	const retryBtn = document.getElementById('retryTestBtn');
	if (retryBtn) {
		retryBtn.addEventListener('click', updateSampleText);
	}
		// Timer and button logic
		const startBtn = document.getElementById('startTestBtn');
		const stopBtn = document.getElementById('stopTestBtn');
		if (startBtn) startBtn.addEventListener('click', startTest);
		if (stopBtn) stopBtn.addEventListener('click', stopTest);
		if (retryBtn) retryBtn.addEventListener('click', resetTest);
		// Set initial button states
		setButtonStates({start: false, stop: true});
});
