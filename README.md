# pm-carousel

Accessible carousel plugin written in JS with no dependencies.

Examples here: [https://lordfpx.github.io/pm-carousel/](https://lordfpx.github.io/pm-carousel/)

## Features

- Fully accessible (if you respect HTML order)
- Keyboard navigation (keyboard arrows, Home and End keys)
- Touch swipe
- Responsive carousel settings
- No dependencies
- Vanilla JS
- Pretty small (about 3.5Kb gzip)

## HTML markup

The HTML order is very important to be fully accessible. You will notice strings like `{text}` or `{nbr}`. They are mandatory and will be replaced by the script.

Full HTML example to use `pm-carousel`:

```html
<div data-pm-carousel>
	<button
		type="button"
		data-pm-carousel-playstop="Stop the carousel|Play the carousel"
		hidden
	>
		{text}
	</button>

	<ul data-pm-carousel-paging hidden>
		<li>
			<button type="button">Slide {nbr}</button>
		</li>
	</ul>

	<div data-pm-carousel-wrapper>
		<div data-pm-carousel-overflow>
			<div data-pm-carousel-item>...</div>
		</div>
	</div>

	<button
		data-pm-carousel-prev="Previous item|Go back to last item"
		type="button"
		hidden
	>
		{text}
	</button>
	<button
		data-pm-carousel-next="Next item|Go back to first item"
		type="button"
		hidden
	>
		{text}
	</button>
</div>
```

### Play and Stop button (optional)

This is the most basic button example. You can **add** any HTML markup that will not break this base. `{text}` will be replaced by the right value defined inside the `data-pm-carousel-playstop` attribute.

```html
<button
	type="button"
	data-pm-carousel-playstop="Stop the carousel|Play the carousel"
	hidden
>
	{text}
</button>
```

### Paging (optional)

The HTML inside the button can be freely personalized. `{nbr}` is mandatory and will be replaced by the slide number.

```html
<ul data-pm-carousel-paging hidden>
	<li>
		<button type="button">Slide {nbr}</button>
	</li>
</ul>
```

### The slides

```html
<div data-pm-carousel-wrapper>
	<div data-pm-carousel-overflow>
		<div data-pm-carousel-item>...</div>
		<div data-pm-carousel-item>...</div>
		<div data-pm-carousel-item>...</div>
	</div>
</div>
```

### Previous and next buttons

This is the most basic button example. You can **add** any HTML markup that will not break this base.

Labels inside `data-pm-carousel-prev` and `data-pm-carousel-next` attributes are used to dynamize `{text}`.

```html
<button
	data-pm-carousel-prev="Previous item|Go back to last item"
	type="button"
	hidden
>
	{text}
</button>

<button
	data-pm-carousel-next="Next item|Go back to first item"
	type="button"
	hidden
>
	{text}
</button>
```

## Settings

Default settings:

```js
{
  loop: true,          // Will loop
  group: 1,            // nbr of slides per page
  spaceAround: 0,      // centered mode with partial view of surrounding slides (express in %)
  noStartSpace: false, // in combinaison with "spaceAround" option, but align left the carousel
  autoplay: 0,         // speed of the autoplay (0 for disabled)
  fullScroll: false,   // Enables full scroll on the last slide to display only the remaining items
}
```

## Usage

```sh
npm i pm-carousel --save
```

In your script:

```js
import pmCarousel from "pm-carousel"
```

If you need to load the script directly on your page, or to import it the "old-fashion way" (see [https://github.com/umdjs/umd](https://github.com/umdjs/umd)), you can find the `umd` version inside the `dist` folder: `pm-carousel.umd.js`.

## Initialize

2 ways to initialize `pm-carousel`:

- For all carousels with default options:

  ```js
  pmCarousel()
  ```

- For specified carousels only (with default options):

  ```js
  const myCarousels = document.querySelectorAll(".my-class")

  pmCarousel({}, myCarousels)
  ```

Both methods can be called again when new carousels are injected into the DOM.

## Settings

2 methods:

- When calling `pmCarousel` function:

  ```js
  pmCarousel({
  	default: {
  		group: 1,
  	},
  	responsive: [
  		{
  			minWidth: "800px",
  			group: 4,
  		},
  		{
  			minWidth: "400px",
  			group: 2,
  		},
  		{
  			minWidth: "600px",
  			disable: true,
  		},
  	],
  })
  ```

- Inside the `data-pm-carousel` (the JSON must be valid!):

  ```html
  <div
  	data-pm-carousel='
      {
        "default": {
          "group": 1
        },
        "responsive": [
          {
            "minWidth": "800px",
            "group": 4
          },
          {
            "minWidth": "400px",
            "group": 2
          },
          {
            "minWidth": "600px",
            "disable": true
          }
        ]
      }'
  >
  	...
  </div>
  ```

## Responsive settings

Have you noticed the `reponsive` key in the above example?
That's the way to make your carousel fully responsive.

You can use whatever unit you want for the `minWidth` setting.

The `disable` setting will deactivate the carousel.
If set to `auto`, the carousel will only be enabled 
when the total number of items is greater than the group size.

## API

The instance of `pm-carousel` can be reached from nodes with `data-pm-carousel` attribute.

### Play and Stop

Only available when Play/Pause button is present.

```JS
const myCarousel = document.querySelector(".class-of-a-carousel");

// Start playing
myCarousels.pmCarousel.play()

// Stop playing
myCarousels.pmCarousel.stop()

// Toggle Play or Stop
myCarousels.pmCarousel.toggleAutoplay()
```

### Change current page

```JS
const myCarousel = document.querySelector(".class-of-a-carousel");
myCarousels.pmCarousel.changeActive(2)
```

### Disable and reinit

```JS
const myCarousel = document.querySelector(".class-of-a-carousel");

// Disable Carousel
myCarousels.pmCarousel.disable()

// Reinit the Carousel again
myCarousels.pmCarousel.reinit()
```
