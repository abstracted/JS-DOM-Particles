const canvas = {
	el: '.canvas',
	bg: 'black'
};
const brush = {
	el: '.brush',
	transition: 100,
	debug: false
};
const paint = {
	instances: 4, // Don't put more than 4
	color: 'lightpink',
	opacity: 0.2,
	blendMode: 'hard-light',
	blur: 0,
	animationNames: [ 'tl', 'tr', 'bl', 'br' ],
	animationDuration: 5,
	max: 25,
};
const buffer = {
	init: 10,
	render: 45,
	wait: 600
};
const degrees = {
	three: 4,
	two: 4,
	hue: 2,
	brushThree: 0,
	brushTwo: 0
};
const random = {
	three: false,
	two: false,
	hue: false,
	brushThree: false,
	brushTwo: false,
	clip: false
};
const points = {
	three: [ 0.7, 0, 0.5 ],
	brushThree: [ 1, 0, 0.5 ],
	// clip: [ 50, 0, 90, 20, 100, 60, 75, 100, 25, 100, 0, 60, 10, 20 ]
};