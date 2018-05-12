class Emitter {
	constructor(bufferObj, paintObj, canvasObj, brushObj, randomObj, degOffset, pointsObj) {
		this.bufferProperties = bufferObj;
		this.counter = {
			buffer: 0,
			render: 0
		};
		this.deg = {
			three: {
				counter: 0,
				offset: degOffset.three
			},
			two: {
				counter: 0,
				offset: degOffset.two
			},
			hue: {
				counter: 0,
				offset: degOffset.hue
			},
			brushThree: {
				counter: 0,
				offset: degOffset.brushThree
			},
			brushTwo: {
				counter: 0,
				offset: degOffset.brushTwo
			}
		};
		this.points = {
			default: pointsObj,
			stored: {
				three: [],
				brushThree: [],
				clip: []
			}
		};
		this.random = randomObj;
		this.template = paintObj;
		this.paintMarkup = {
			tl: [],
			tr: [],
			bl: [],
			br: []
		};
		this.canvas = document.querySelector(canvasObj.el);
		this.brush = document.querySelector(brushObj.el);
		this.brushTransition = brushObj.transition;
		this.brushDebug = brushObj.debug;
		this.rendering = false;
	}

	checkCounter(index) {
		if( index >= Number.MAX_VALUE || index === Number.NaN ) {
			index = 0;
		}
		return index;
	}

	getRandom(offset, decimal) {
		if( decimal === true || typeof type !== 'undefined' ) {
			return ( Math.random() * offset ).toFixed(1);
		} else {
			return Math.ceil(( Math.random() * offset ));
		}
	}

	getRotation(type) {
		let num = 1;
		if( this.random[ type ] ) {
			num = this.getRandom(360, false);
		} else {
			this.deg[ type ].counter += this.deg[ type ].offset;
			this.deg[ type ].counter = this.checkCounter(this.deg[ type ].counter);
			num = this.deg[ type ].counter;
		}
		return num;
	}

	getPoints(type, offset, decimal) {
		let points;
		if( this.random[ type ] ) {
			points = [];
			let amount = this.points.default[ type ].length;
			for ( let i = 0; i < amount; i++ ) {
				points[ i ] = this.getRandom(offset, decimal);
			}
			this.points.stored[ type ][ this.counter.buffer ] = points;
		} else {
			points = this.points.default[ type ];
		}
		return points;
	}

	getClipText(points) {
		let ct = 'polygon(';
		for ( let i = 0; i < points.length; i++ ) {
			ct += points[ i ] + '%';
			if (i === points.length - 1) {
				break;
			} else if( i % 2 !== 0 ) {
				ct += ', ';
			} else {
				ct += ' ';
			}
		}
		ct += ')';
		return ct;
	}

	moveBrush() {
		let brushTwoDeg = this.getRotation('brushTwo');
		let brushThreeDeg = this.getRotation('brushThree');
		let pointsThree = this.getPoints('brushThree', 1, true);
		let pointsText = pointsThree[ 0 ] + ', ' + pointsThree[ 1 ] + ', ' + pointsThree[ 2 ] + ',';
		this.brush.style.transform = 'rotate3d(' + pointsText + ( brushThreeDeg * 1 ) + 'deg)' +
			' rotate(' + brushTwoDeg + 'deg)';
		this.brush.style.top = this.getRandom(this.canvas.clientHeight) + 'px';
		this.brush.style.right = this.getRandom(this.canvas.clientWidth) + 'px';
	}

	paintHTML(i, index, paintData) {
		let location;
		switch ( i ) {
			case 0:
				location = 'tl';
				break;
			case 1:
				location = 'tr';
				break;
			case 2:
				location = 'bl';
				break;
			case 3:
				location = 'br';
				break;
		}
		this.paintMarkup[ location ][ index ] = document.createElement('div');
		this.paintMarkup[ location ][ index ].setAttribute('class', 'paint');
		this.paintMarkup[ location ][ index ].style.cssText = paintData.locationText + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' background-color: ' + this.template.color + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' opacity: ' + this.template.opacity + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' mix-blend-mode: ' + this.template.blendMode + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' transform: ' + paintData.transform + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' filter: ' + paintData.filter + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' animation-name: ' + paintData.animationName + ';';
		this.paintMarkup[ location ][ index ].style.cssText += ' animation-duration: ' + this.template.animationDuration
			+ 's;';
		// this.paintMarkup[ location ][ index ].style.cssText += ' clip-path: ' + paintData.clipPath + ';';
		this.paintMarkup[ location ][ index ].style.cssText += '"></div>';
	}

	buffer() {
		let counter = this.counter.buffer;
		let left = Math.round(this.brush.getBoundingClientRect().left);
		let right = Math.round(this.brush.getBoundingClientRect().right);
		let top = Math.round(this.brush.getBoundingClientRect().top);
		let bottom = Math.round(this.brush.getBoundingClientRect().bottom);
		let threeDeg = this.getRotation('three');
		let threePoints = this.getPoints('three', 1, true);
		let threeText = threePoints[ 0 ] + ', ' + threePoints[ 1 ] + ', ' + threePoints[ 2 ] + ', ';
		let twoDeg = this.getRotation('two');
		let hueDeg = this.getRotation('hue');
		let blur = this.template.blur;
		// let cP = this.getPoints('clip', 100, false);
		let paintData = {
			// clipPath: this.getClipText(cP),
			filter: 'hue-rotate(' + hueDeg + 'deg) blur(' + blur + 'px)'
		};
		for ( let i = 0; i < this.template.instances; i++ ) {
			switch ( i ) {
				case 0:
					paintData.transform = 'rotate3d(' + threeText + threeDeg + 'deg)' +
						' rotate(' + twoDeg + 'deg)';
					paintData.animationName = this.template.animationNames[ 0 ];
					paintData.locationText = 'top: ' + top + 'px; left: ' + left + 'px';
					break;
				case 1:
					paintData.transform = 'rotate3d(' + threeText + ( threeDeg * -1 ) + 'deg)' +
						' rotate(' + ( twoDeg * -1 ) + 'deg)';
					paintData.animationName = this.template.animationNames[ 1 ];
					paintData.locationText = 'top: ' + top + 'px; right: ' + right + 'px';
					break;
				case 2:
					paintData.transform = 'rotate3d(' + threeText + ( threeDeg * -1 )+ 'deg)' +
						' rotate(' + ( twoDeg * -1 ) + 'deg)';
					paintData.animationName = this.template.animationNames[ 2 ];
					paintData.locationText = 'bottom: ' + bottom + 'px; left: ' + left + 'px';
					break;
				case 3:
					paintData.transform = 'rotate3d(' + threeText + threeDeg  + 'deg)' +
						' rotate(' + twoDeg + 'deg)';
					paintData.animationName = this.template.animationNames[ 3 ];
					paintData.locationText = 'bottom: ' + bottom + 'px; right: ' + right + 'px';
					break;
			}
			this.paintHTML(i, counter, paintData);
		}
		this.counter.buffer++;
		this.counter.buffer = this.checkCounter(this.counter.buffer);
	}

	render() {
		let rendering = setInterval(() => {
			for ( let location in this.paintMarkup ) {
				if( this.paintMarkup[ location ][ this.counter.render ] ) {
					this.canvas.appendChild(this.paintMarkup[ location ][ this.counter.render ]);
				}
			}
			this.counter.render++;
			this.counter.render = this.checkCounter(this.counter.render);
			this.clean();
		}, this.bufferProperties.render);
	}

	clean() {
		if( this.counter.render > this.template.max ) {
			for ( let i = 0; i < this.template.instances; i++ ) {
				this.canvas.removeChild(this.canvas.childNodes[ 0 ]);
			}
			for (let location in this.paintMarktup) {
				console.log(location)
			}
		}
	}

	run() {
		if( this.brushDebug === true ) {
			this.brush.style.cssText = 'background: green; width: 50px; height: 50px;';
		}
		let painting = setInterval(() => {
			this.moveBrush();
		}, this.brushTransition);
		let buffering = setInterval(() => {
			this.buffer();
			if( this.counter.buffer >= this.bufferProperties.wait) {
				if( this.rendering === false ) {
					this.render();
					this.rendering = true;
				}
			}
		}, this.bufferProperties.init);
	}
}

const particles = new Emitter(buffer, paint, canvas, brush, random, degrees, points);
particles.run();