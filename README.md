# libresprite-extensions
Scripts that update an image. Download them using the Code / Download Zip.. button, put them in the LibreSprite scripts directory (Scripts/Open Folder in LibreSprite), and the select Scripts/Rescan scripts. 

- The `increase`/`decreaseLuminosity` scripts directly increase/decrease the RGB components by 10%.

- The other `increase`/`decrease` scripts (`Hue`, `Saturation`, `Lightness`) change the corresponding components of the pixel when it's converted to HSL. Hue is changed by +/- 15° on the 360° wheel, and the Saturation and Lightness by +/- 10%. 
You can easily change these values in the script, around line 101 at the time of this writing.

- The `grisaille` script just removes all the color from your sprite and turns it into shades of grey (but the sprite and color palette is still rgb). 

- The `monochrome` script makes it.. monochrome. There is no dialog to pick the color, so you have to edit the first line of code in the script to select the hue you want. 

**Warnings**

- The changes can not be undone, if you want to get back from a change you need to close and reopen your working file, so you probably should to save your file before using the scripts. 

**TODO** 

- Save an image automatically before making any update to the sprite, or find a way to undo a change
- And/or Make some sort of preview
