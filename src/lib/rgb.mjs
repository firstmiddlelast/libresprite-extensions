// For the formula, see https://bisqwit.iki.fi/story/howto/dither/jy/
export function rgbDistance (r1, g1, b1, r2, g2, b2) {
    const luma1 = (r1*299 + g1*587 + b1*114) / (255.0*1000);
    const luma2 = (r2*299 + g2*587 + b2*114) / (255.0*1000);
    const lumadiff = luma1-luma2;
    const diffR = (r1-r2)/255.0, diffG = (g1-g2)/255.0, diffB = (b1-b2)/255.0;
    return (diffR*diffR*0.299 + diffG*diffG*0.587 + diffB*diffB*0.114)*0.75
         + lumadiff*lumadiff;
}

export function rgbSquaredDistance (r1, g1, b1, r2, g2, b2) {
    return (r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2;
}
