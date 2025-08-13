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
});
