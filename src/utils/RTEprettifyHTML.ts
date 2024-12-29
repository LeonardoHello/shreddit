export const prettifyHTML = (html: string) => {
  return (
    html
      // Replace multiple spaces between letters with a single space
      .replace(/(\S)\s+(\S)/g, "$1 $2")
      // Remove all but one  empty <p> tag
      .replace(/(<p>\s*<\/p>){2,}/g, "<p></p>")
      // Limit consecutive <br> tags to a maximum of 2
      .replace(/(<br\s*\/?>\s*){3,}/g, "<br><br>")
      .replace(/^<p>\s*<\/p>/g, "") // Remove empty <p></p> at the start
      .replace(/<p>\s*<\/p>$/g, "") // Remove empty <p></p> at the end
      .replace(/^<br\s*\/?>/g, "") // Remove <br> at the start
      .replace(/<br\s*\/?>$/g, "") // Remove <br> at the end
  );
};
