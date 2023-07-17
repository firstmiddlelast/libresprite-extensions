# libresprite-extensions
Scripts that update an image. Download them using the Code / Download Zip.. button, put them in the LibreSprite scripts directory (Scripts/Open Folder in LibreSprite), and the select Scripts/Rescan scripts. 

- The `increase`/`decreaseLuminosity` scripts directly increase/decrease the RGB components by 10%.

- The other `increase`/`decrease` scripts (`Hue`, `Saturation`, `Lightness`) change the corresponding components of the pixel when it's converted to HSL. Hue is changed by +/- 15° on the 360° wheel, and the Saturation and Lightness by +/- 10%. 
You can easily change these values in the script, around line 101 at the time of this writing.

- The `grisaille` script just removes all the color from your sprite and turns it into shades of grey (but the sprite and color palette is still rgb). 

- The `monochrome` script makes it.. monochrome. There is no dialog to pick the color, so you have to edit the first lines of code in the script to select the hue you want (see the script first lines for additional help).

- The `outline` script creates an outline around all the non-transparent pixels of an image. You can edit the first lines of the script to select the outline color and the outline mode (either with or without diagonals). What's more, due to the way sprites are stored in LibreSprite, you need to draw a non-empty pixel on the top left and bottom right of your sprite before using the script. You can delete these pixels after the outline has been drawn.
Exemple use : select the item you want to outline with the magic wand, copy it into a new sprite at least 2 pixels larger (to give room for the outline), draw the top left and bottom right pixels, and use the script. Then you can copy the outlined item back into your project.

- the `palettize` script changes the pixels in your image to the closest color in your palette. Example use : load an image, load your palette, use the scripts : now your image is composed of pixels that belong in your palette. 

**Warnings**

- The changes can not be undone, if you want to get back from a change you need to close and reopen your working file, so you probably should to save your file before using the scripts. 

**TODO** 

- Save an image automatically before making any update to the sprite, or find a way to undo a change
- And/or Make some sort of preview
