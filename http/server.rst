Server
======

The server object and its components provide convenient and robust functionality to manage inbound
server requests and outbound responses. At its core, and like the client object, the server object
is compromised of a request object and a response object. However, opposite to the client object,
the server object's request is typically auto-populated from the incoming request headers and data,
while the response object is available to be configured as required to produce and send a response
to the calling client.
