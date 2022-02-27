// adapted from https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
// call groupby(list to group, function which takes one argument which will be called on each element of the list to determine groups)
export function groupBy (xs, func) {
  return xs.reduce(function (rv, x) {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {});
};

// transforms the list of prerequisites into a human readable format, like what is on the current flowchart
export function getNotes (oldPrereqs) {
  let prereqs = oldPrereqs.slice();
  if (!(typeof prereqs == 'undefined') && (prereqs.length > 0)) {
    let lastSubject = prereqs[0].slice(0, 4);
    for (let i = 1; i < prereqs.length; i++) {
      if (prereqs[i].slice(0, 4) == lastSubject) {
        prereqs[i] = prereqs[i].slice(5,);
      } else {
        lastSubject = prereqs[i].slice(0, 4);
      }
    }
    return 'Prereqs: ' + prereqs.join(' & ');
  } else {
    return "";
  }
}