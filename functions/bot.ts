// netlify/functions/hello.js

exports.handler = async () => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello, Netlify Function!" }),
    };
  };
  