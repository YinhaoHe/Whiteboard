"use strict";

/*
 * A class for all the operations used in this web application
 * 
 * @note I was going to put it in a separate JS module; however,
 * Chromium-based browsers will refuse to run because their cross-domain
 * policies do not allow JS modules to be referenced as local files
 * unless they are run as a web server
 */
class Utilities
{
	// A variable to decide whether the browser should the users can scribble
	// on the whiteboard
	static drawingAllowed = false;
	
	/*
	 * Change the cursor of the whiteboard to "crosshair" or "cell" depending
	 * which button is clicked
	 * @param event an event detailing the state of the webpage
	 * when the users click the pen/eraser icon
	 */
	static changeCursor(event)
	{
		document.querySelector("#whiteboard").style.cursor =
			(event.srcElement.id === "pen-icon" || event.srcElement.id === "pen")
				? "crosshair" : "cell";
	}
	
	/*
	 * Change the color of the icon to the one in the panel
	 * when the users move their mouse towards the icon
	 * @param event an event detailing the state of the webpage
	 * when the users move their mouse towards the icon
	 */
	static changeColor(event)
	{
		event.srcElement.style.color = document.querySelector("#color-picker").value;
	}
	
	/*
	 * Change the color of the icons to black when the users move
	 * their mouse away
	 * @param event an event detailing the state of the webpage
	 * when the users move their mouse away from the icon
	 */
	static revertColor(event)
	{
		event.srcElement.style.color = "#000000";
		document.querySelectorAll(".las").forEach((icon) => icon.style.color = "#000000");
	}
	
	/*
	 * Change the size of the whiteboard as the users resizing the browser
	 */
	static resizeWhiteboard()
	{
		let whiteboard = document.querySelector("#whiteboard"),
			context = whiteboard.getContext("2d"),
			data = context.getImageData(0, 0, whiteboard.width, whiteboard.height);
		whiteboard.width = 0.8 * window.innerWidth;
		whiteboard.height = 0.8 * window.innerHeight;
		context.putImageData(data, 0, 0);
	}

	/*
	 * Draw/erase the scribbles on the whiteboard
	 * @param event an event detailing the state of the webpage
	 * when the users click on the whiteboard
	 */
	static drawOrErase(event)
	{
		let color = (document.querySelector("#whiteboard").style.cursor === "crosshair")
				? document.querySelector("#color-picker").value
				: "rgba(0, 0, 0, 1)",
			whiteboard = document.querySelector("#whiteboard"),
			whiteboardInfo = whiteboard.getBoundingClientRect(),
			context = whiteboard.getContext("2d");
			
		if (Utilities.drawingAllowed)
		{
			context.globalCompositeOperation =
				(document.querySelector("#whiteboard").style.cursor === "crosshair")
					? "source-over"
					: "destination-out";
			context.lineWidth = document.querySelector("#thickness").value;
			context.strokeStyle = color;
			context.lineJoin = "round";
			context.lineTo(event.x-whiteboardInfo.left, event.y-whiteboardInfo.top);
			context.stroke();
		}
	}

	/*
	 * Handle the event on the whiteboard when the mouse is
	 * pressed on the whiteboard
	 * @param event an event detailing the state of the webpage
	 * when the users press the mouse on the whiteboard
	 */
	static mouseDownWhiteboard(event)
	{
		Utilities.drawingAllowed = true;
		Utilities.drawOrErase(event);
	}

	/*
	 * Handle the event on the whiteboard when the mouse is not
	 * pressed on the whiteboard
	 * @param event an event detailing the state of the webpage
	 * when the users move their mouse away from the whiteboard
	 */
	static mouseUpWhiteboard(event)
	{
		Utilities.drawingAllowed = false;
		document.querySelector("#whiteboard").getContext("2d").beginPath();
	}
	
	/*
	 * Show the grid when the grid option is selected
	 * @param event an event detailing the state of the webpage
	 * when the users click on the grid option
	 */
	static displayGrid(event)
	{
		let whiteboard = document.querySelector("#whiteboard");
		if (event.srcElement.checked)
		{
			whiteboard.style.backgroundImage = "url('img/grid.jpg')";
			whiteboard.style.backgroundRepeat = "repeat";
			whiteboard.style.borderStyle = "none";
			whiteboard.style.borderWidth = "none";
		}
		else
		{
			whiteboard.style.backgroundImage = "";
			whiteboard.style.backgroundRepeat = "";
			whiteboard.style.borderStyle = "dashed";
			whiteboard.style.borderWidth = "1px";
		}
	}
	
	/*
	 * Clear everything on the whiteboard
	 * @param event an event detailing the state of the webpage
	 * when the users press the clear button
	 */
	static clearAll(event)
	{
		document.querySelector("#whiteboard")
				.getContext("2d")
				.clearRect(0, 0, whiteboard.width, whiteboard.height);
	}
}

/*
 * A function for registering event listeners for all buttons
 * and initializing whatever the webpage needs
 */
function main()
{
	// Add listeners to change the color of the icons to the one in the
	// color panel when users move to them
	document.querySelectorAll(".input-button").forEach((element) => {
		element.addEventListener("mouseover", Utilities.changeColor);
		element.addEventListener("mouseleave", Utilities.revertColor);
	});

	// Add listeners to change the type of input when users click the
	// pen/eraser button
	document.querySelectorAll("#pen, #eraser")
			.forEach((inputButton) => inputButton.addEventListener(
				"click", Utilities.changeCursor));

	// Add a listener so that the grid can be displayed when the option is clicked
	document.querySelector("#grid").addEventListener("click", Utilities.displayGrid);
	
	// Add a listener to erase everything on the whiteboard when users click
	// on the clear button
	document.querySelector("#reset").addEventListener("click", Utilities.clearAll);
	
	// Add listeners to react to the users when they click on the whiteboard
	let whiteboard = document.querySelector("#whiteboard");
	whiteboard.addEventListener("mouseup", Utilities.mouseUpWhiteboard);
	whiteboard.addEventListener("mousedown", Utilities.mouseDownWhiteboard);
	whiteboard.addEventListener("mousemove", Utilities.drawOrErase);
	
	// Change the cursor style on the whiteboard
	whiteboard.style.cursor = "crosshair";
	
	// Add a listener to resize the whiteboard as the browser window changes
	window.addEventListener("resize", Utilities.resizeWhiteboard);
	Utilities.resizeWhiteboard();
}



// Make sure that the browser will execute main() when the webpage loads
window.onload = main;