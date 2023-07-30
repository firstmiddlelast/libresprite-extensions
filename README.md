# libresprite-extensions
Scripts that update an image. Download them using the Code / Download Zip.. button, put them in the LibreSprite scripts directory (Scripts/Open Folder in LibreSprite), and the select Scripts/Rescan scripts. ONLY THE .JS FILES AT THE ROOT OF THE ZIP FILE ARE REQUIRED, the src/ directory can be omitted. 

- `increase`/`decreaseLuminosity` directly increase/decrease the RGB components by 10%.

- The other `increase`/`decrease` scripts (`Hue`, `Saturation`, `Lightness`) change the corresponding components of the pixel when it's converted to HSL. Hue is changed by +/- 15° on the 360° wheel, and the Saturation and Lightness by +/- 10%. 
You can easily change these values in the script, around line 10-11 at the time of this writing.

- `grisaille` just removes all the color from your sprite and turns it into shades of grey (but the sprite and color palette is still rgb). 

- `monochrome` makes it.. monochrome. There is no dialog to pick the color, so you have to edit lines of code in the script (look for the string "EDIT") to select the hue you want.

- `outline` creates an outline around all the non-transparent pixels of an image. You can edit lines of the script (look for the string "EDIT") to select the outline color and the outline mode (either with or without diagonals). What's more, due to the way sprites are stored in LibreSprite, you need to draw a non-empty pixel on the top left and bottom right of your sprite before using the script. You can delete these pixels after the outline has been drawn.
Exemple use : select the item you want to outline with the magic wand, copy it into a new sprite at least 2 pixels larger (to give room for the outline), draw the top left and bottom right pixels, and use the script. Then you can copy the outlined item back into your project.

- `palettize` changes the pixels in your image to the closest color in your palette. Example use : load an image, load your palette, use the scripts : now your image is composed of pixels that belong in your palette. You can select one of "RGB" or "LAB" methods by editing the file (look for the string "EDIT") ; "LAB" often gives buggy and worse results than "RGB" but it can lead to interesting results. Also, you can select dithering options (no dithering is applied by default). Dithering available options are Atkinson, Floyd-Steinberg, and Jarvis-Judice-Ninke.. Others are incoming. 

- `pixellate` creates pixels of the specified size (you can select it in the script - look for the string "EDIT"). This can be useful if you want to "pixellate" an image without changing its size (i.e. making "big" pixels). You can select one of "RGB" or "LAB" methods, they give slightly different results from which you may choose. 

- `countTiles` counts unique tiles in the sprite and displays the results in the console, in the form : "{number of occurences} : {list of coordinates of the tiles that have that number of occurences}". The number of unique tiles is displayed first. You need to edit the script to fit your tile size (look for the string "EDIT").

- `reducePalette` reduces the palette size : when 2 colors are close to each other in the palette, it removes one of them. This does NOT change the image, just the palette. You can select your target palette size by editing the script file (look for the string "EDIT"). 
When two colors are alike, it removes the first, or the last one in the palette, or the one that's the closest to all the other colors, depending on the option you select by editing the file.

- `reduceTilesCount` reduces the number of tiles required to draw the current image. It does this by replacing tiles that resemble the most to other tiles, starting by the rarest ones. The difference between two tiles is the sum of the rgb differences between both tile pixels -but other algorithms are possible, hit me if you think another way of calculating this would be better. You can adjust the tile size and the final tiles count by editing the script (look for the string "EDIT").

- `reorganizePalette` reorders the colors in your palette according to your specifications (by HSL or RGB components, pixel count, or whiteness). Details can be found in the script file, after the string "EDIT".

- `synthesizeTexture` fills an image with a texture that is created using the Image Quilting algorithm by Alexei A. Efros and William T. Freeman. To use it, you need to put your texture in an empty image, exactly at the top left corner. Then, you need to set a non-empty pixel at the bottom right of your image -you can draw anything with the pen, or paste your texture.. anything, so long as the bottom and the right borer of the image is touched by a non transparent pixel. And then, just use the script. The result is partially random, so you will get different results every time. You can adjust the script parameters in the script, as usual, by looking for the string "EDIT". Read carefully the parameters description.

- `mergeChanges` allows you to merge the changes made to an original image by 2 different people who were working on it at the same time. To use it, put the original image on the top left of an empty sprite sheet ; you put the image modified by, say, Alice, exactly one pixel below it (meaning you have to leave an empty line of one pixel) ; on the right of this one, you put the image modified by, say, Bob (leaving an empty column of one pixel). And the you run the script. The original image will be deleted, the only pixels left are those that are conflicting (modified by both Alice and Bob) ; and to the right of the original image, you'll see Alice and Bob's changes merged into the original image. 

**Warnings**

- The changes from scripts can not be undone with Edit/Undo : if you want to get back from a change you need to close and reopen your working file, so you probably should to save your file before using the scripts. 

**TODO** 

- Implement a way to undo a change
