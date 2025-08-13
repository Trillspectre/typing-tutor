function getBestWpm(level) {
	if (!level) return '-';
	const best = localStorage.getItem('bestWpm_' + level);
	return best ? best : '-';
}

function setBestWpm(level, wpm) {
	if (!level || !wpm || isNaN(wpm)) return false;
	const currentBest = parseInt(localStorage.getItem('bestWpm_' + level) || '0', 10);
	if (wpm > currentBest) {
		localStorage.setItem('bestWpm_' + level, wpm);
		return true; // New high score
	}
	return false;
}

function displayBestWpm(level) {
	const bestWpmSpan = document.getElementById('resultBestWpm');
	if (bestWpmSpan) bestWpmSpan.textContent = getBestWpm(level);
}
function highlightTypedWords(userInput, sampleText) {
	const userWords = userInput.trim().length > 0 ? userInput.trim().split(/\s+/) : [];
	const sampleWords = sampleText.trim().split(/\s+/);
	let highlighted = '';
	for (let i = 0; i < sampleWords.length; i++) {
		let word = sampleWords[i];
		if (userWords[i] !== undefined && userWords[i].length > 0) {
			if (userWords[i] === word) {
				highlighted += `<span style=\"color: #0d6efd; font-weight: bold;\">${word}</span>`;
			} else {
				highlighted += `<span style=\"color: #dc3545; font-weight: bold;\">${word}</span>`;
			}
		} else {
			highlighted += word;
		}
		if (i < sampleWords.length - 1) highlighted += ' ';
	}
	return highlighted;
}
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
		// Store and display best WPM for this level
		const isNewHigh = setBestWpm(difficulty, wpm);
		displayBestWpm(difficulty);
		// Show congrats message if new high score
		const congrats = document.getElementById('bestWpmCongrats');
		if (congrats) {
			if (isNewHigh) {
				congrats.style.display = '';
			} else {
				congrats.style.display = 'none';
			}
		}
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
	// Hide congrats message
	const congrats = document.getElementById('bestWpmCongrats');
	if (congrats) congrats.style.display = 'none';
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
	// Clear best WPM display
	const difficulty = document.getElementById('difficultySelect').value;
	displayBestWpm(difficulty);
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
	// Set initial level display
	const difficultySelect = document.getElementById('difficultySelect');
	displayLevel(difficultySelect ? difficultySelect.value : '-');
	// Show best WPM for initial level
	displayBestWpm(difficultySelect ? difficultySelect.value : '-');
	// Update best WPM display when difficulty changes
	if (difficultySelect) {
		difficultySelect.addEventListener('change', function() {
			displayBestWpm(difficultySelect.value);
		});
	}
	// Disable typing input by default
	const typingInput = document.getElementById('typingInput');
	if (typingInput) typingInput.disabled = true;

		// Instructions modal logic
		const instructionsBtn = document.getElementById('instructionsBtn');
		if (instructionsBtn) {
			instructionsBtn.addEventListener('click', function() {
				const modal = new bootstrap.Modal(document.getElementById('instructionsModal'));
				modal.show();
			});
		}

		// Add a display area for highlighted text above the input box
		const sampleTextP = document.getElementById('sampleText');
		let highlightDisplay = document.getElementById('highlightedSampleText');
		if (!highlightDisplay && sampleTextP) {
			highlightDisplay = document.createElement('div');
			highlightDisplay.id = 'highlightedSampleText';
			highlightDisplay.style.marginTop = '0.5rem';
			highlightDisplay.style.minHeight = '1.5em';
			sampleTextP.parentNode.insertBefore(highlightDisplay, sampleTextP.nextSibling);
		}

		function updateHighlight() {
			const userInput = typingInput ? typingInput.value : '';
			const sampleText = sampleTextP ? sampleTextP.textContent : '';
			if (highlightDisplay) {
				highlightDisplay.innerHTML = highlightTypedWords(userInput, sampleText);
			}
		}

		if (typingInput) {
			typingInput.addEventListener('input', updateHighlight);
		}

		// Update highlight when sample text changes or test is reset
		const observer = new MutationObserver(updateHighlight);
		if (sampleTextP) {
			observer.observe(sampleTextP, { childList: true });
		}
		if (typingInput) {
			typingInput.addEventListener('focus', updateHighlight);
		}
		updateHighlight();

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
	if (difficultySelect) {
		difficultySelect.addEventListener('change', function() {
			updateSampleText();
			// Clear typing input when difficulty changes
			const typingInput = document.getElementById('typingInput');
			if (typingInput) typingInput.value = '';
		});
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
