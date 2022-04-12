// adapted from https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
// call groupby(list to group, function which takes one argument which will be called on each element of the list to determine groups)
// returns mapping of unique elements when function applied to elements of list to elements of list with property
export function groupBy(xs, func) {
  return xs.reduce(function (rv, x) {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {});
};

// transforms the list of prerequisites into a human readable format, like what is on the current flowchart
export function getNotes(oldPrereqs) {
  let prereqs = oldPrereqs.slice();
  if (!(typeof prereqs == 'undefined') && (prereqs.length > 0)) {
    let lastSubject = prereqs[0].slice(0, 4); // gets subject of class (ex. CSCI, ENGL)
    for (let i = 1; i < prereqs.length; i++) { // goes through rest of prereqs
      if (prereqs[i].slice(0, 4) == lastSubject) { // if same subject
        prereqs[i] = prereqs[i].slice(5,); // get class number (remove subject from class ID)
      } else {
        lastSubject = prereqs[i].slice(0, 4); // set last subject to new subject
      }
    }
    return 'Prereqs: ' + prereqs.join(' & '); // make string, separated by &s
  }
  return "";
}

/*** function that returns if white or black text will have better contrast with the color passed ***/
export function isDarkBackground(bgCol) {
  // bgRGB gets the parts of the background color in hex format to rgb format
  let bgRGB = bgCol.slice(1).match(/.{1,2}/g).map(x => Number.parseInt(x, 16));
  return (bgRGB[0] * 0.299 + bgRGB[1] * 0.587 + bgRGB[2] * 0.114) > 186; // predefined formula for if a color is dark
}