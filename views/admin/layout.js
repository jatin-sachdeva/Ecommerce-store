// this file will have general structure of all the html documents rendered for admin
module.exports = ({ content }) => {
	return `
      <! DOCTYPE html>
      <html>
            <head>

            </head>


            <body>
                ${content}
            </body>
        <html>
    `;
};
