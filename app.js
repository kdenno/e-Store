const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST><input type="text" name="message"><button type="submit">Submit</button></form>');
        return res.end();
    };
    if(url === '/message'){
        fs.writeFileSync('msg.txt', 'Dummy data');
        res.statusCode=302;
        // Redirect request
        res.setHeader('Location', '/');
        return res.end();

    }
});
server.listen(8000);