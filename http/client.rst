Client
======

At its core, the client object works with a request object, a handler object and a response object
to successfully execute an HTTP request. The request object can have request data. Both the request
and response objects can have headers and a body. The response object will have a response code and
response message, along with other helper functions to determine if the request yielded a successful
response or an error.

Quickstart
----------