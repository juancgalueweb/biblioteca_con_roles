export const commentShortener = (comment) => {
  const original = comment.split(" ");
  if (original.length < 25) {
    return comment;
  } else {
    let shorter = comment.split(" ").splice(0, 25);
    shorter = shorter.join(" ").replace(/,\s*$/, "");
    return shorter.concat("...");
  }
};
