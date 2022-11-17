pop-mime
========

The `popphp/pop-mime` is a component that provides the ability to work with MIME messages and content.
With it, you can generate properly-formatted MIME messages with all their related headers and parts,
or you can parse pre-existing MIME messages into their respective objects and work with them from there.
This can be utilized with mail and HTTP components, such as `pop-mail` and `pop-http`.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-mime

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-mime": "^1.1.2"
        }
    }

Basic Use
---------

**Creating a Simple MIME Message**

.. code-block:: php

    use Pop\Mime\Message;
    use Pop\Mime\Part\Body;

    $message = new Message();
    $message->addHeaders([
        'Subject' => 'Hello World',
        'To'      => 'test@test.com',
        'Date'    => date('m/d/Y g:i A')
    ]);

    $body = new Body("Hello World!");
    $message->setBody($body);

    echo $message;

This will produce the following MIME message:

.. code-block:: text

    Subject: Hello World
    To: test@test.com
    Date: 11/13/2019 5:38 PM

    Hello World!

**Complex Headers**

The header object allows you to create complex MIME headers with supporting parameters.
You can also control things like the wrap of longer headers with multiple lines
and indentation of those header lines:

.. code-block:: php

    use Pop\Mime\Part\Header;

    $header = new Header('Content-Disposition', 'form-data');
    $header->addParameter('name', 'image')
        ->addParameter('filename', '/tmp/some image.jpg')
        ->addParameter('foo', 'Some other param')
        ->addParameter('bar', 'another')
        ->addParameter('baz', 'one more parameter');

    $headerParsed->setWrap(76)
        ->setIndent("\t");

    echo $header;

The above header will look like:

.. code-block:: text

    Content-Disposition: form-data; name=image; filename="some image.jpg";
	    foo=bar; bar=another; baz="one more parameter"

**Multi-part MIME Message**

Below is an example of a text and HTML multi-part MIME message:

.. code-block:: php

    use Pop\Mime\Message;
    use Pop\Mime\Part;

    $message = new Message();
    $message->addHeaders([
        'Subject'      => 'Hello World',
        'To'           => 'test@test.com',
        'Date'         => date('m/d/Y g:i A'),
        'MIME-Version' => '1.0'
    ]);

    $message->setSubType('alternative');

    $html = new Part();
    $html->addHeader('Content-Type', 'text/html');
    $html->setBody(
        '<html><body><h1>This is the HTML message.</h1></body></html>'
    );

    $text = new Part();
    $text->addHeader('Content-Type', 'text/plain');
    $text->setBody('This is the text message.');

    $message->addParts([$html, $text]);

    echo $message;

.. code-block:: text

    Subject: Hello World
    To: test@test.com
    Date: 11/13/2019 5:44 PM
    MIME-Version: 1.0
    Content-Type: multipart/alternative;
    	boundary=f86344638714cf8a0c8e7bcf89b8fd10552b921a

    This is a multi-part message in MIME format.
    --f86344638714cf8a0c8e7bcf89b8fd10552b921a
    Content-Type: text/html

    <html><body><h1>This is the HTML message.</h1></body></html>
    --f86344638714cf8a0c8e7bcf89b8fd10552b921a
    Content-Type: text/plain

    This is the text message.
    --f86344638714cf8a0c8e7bcf89b8fd10552b921a--

**Multi-part MIME Message with an Attachment**

.. code-block:: php

    use Pop\Mime\Message;
    use Pop\Mime\Part;

    $message = new Message();
    $message->addHeaders([
        'Subject'      => 'Hello World',
        'To'           => 'test@test.com',
        'Date'         => date('m/d/Y g:i A'),
        'MIME-Version' => '1.0'
    ]);

    $message->setSubType('mixed');

    $html = new Part();
    $html->addHeader('Content-Type', 'text/html');
    $html->setBody('<html><body><h1>This is the HTML message.</h1></body></html>');

    $text = new Part();
    $text->addHeader('Content-Type', 'text/plain');
    $text->setBody('This is the text message.');

    $file = new Part();
    $file->addHeader('Content-Type', 'application/pdf');
    $file->addFile('test.pdf');

    $message->addParts([$html, $text, $file]);

    echo $message;

The above message will produce the following:

.. code-block:: text

    Subject: Hello World
    To: test@test.com
    Date: 11/13/2019 5:46 PM
    MIME-Version: 1.0
    Content-Type: multipart/mixed;
    	boundary=5bedb090b0b35ce8029464dbec97013c3615cc5a

    This is a multi-part message in MIME format.
    --5bedb090b0b35ce8029464dbec97013c3615cc5a
    Content-Type: text/html

    <html><body><h1>This is the HTML message.</h1></body></html>
    --5bedb090b0b35ce8029464dbec97013c3615cc5a
    Content-Type: text/plain

    This is the text message.
    --5bedb090b0b35ce8029464dbec97013c3615cc5a
    Content-Type: application/pdf
    Content-Disposition: attachment; filename=test.pdf
    Content-Transfer-Encoding: base64

    JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURl
    Y29kZT4+CnN0cmVhbQp4nC3KPQvCQBCE4X5/xdRC4uya3F1gOUhAC7vAgYXY+dEJpvHv5yIyMMXL

    [...base64 encoded file contents...]

    QzQ2RUUyMDU1RkIxOEY3PiBdCi9Eb2NDaGVja3N1bSAvNUZDMzQxQzBFQzc0MTA2MTZEQzFGRjk4
    MDdFMzNFRDgKPj4Kc3RhcnR4cmVmCjc2NDQKJSVFT0YK

    --5bedb090b0b35ce8029464dbec97013c3615cc5a--

**Parsing MIME Messages**

*Note: This component adheres to the MIME standard which uses CRLF ("\r\n") for line breaks.
If a mime message does not adhere to this standard, parsing may not work as intended.*

To parse MIME messages and content, you can take the string of MIME message content
and pass it in the following method and it will return a message object with
all of the related headers and parts.

.. code-block:: php

    use Pop\Mime\Message;

    $message = Message::parseMessage($messageString);

**Parsing a header string:**

If you happen to have the MIME header string, you can parse just that like below.
This will return an array of header objects:

.. code-block:: php

    use Pop\Mime\Message;

    $headers = Message::parseMessage($headerString);

**Parsing a body string:**

If you happen to have the MIME body string, you can parse just that like below.
This will return an array of part objects:

.. code-block:: php

    use Pop\Mime\Message;

    $parts = Message::parseBody($bodyString);

**Parsing a single part string:**

And if you happen to have the string of a single MIME part, you can parse just
that like below. This will return a part object:

.. code-block:: php

    use Pop\Mime\Message;

    $part = Message::parsePart($partString);

**Parsing form data:**

As a special case, if you have `multipart/form-data` MIME content, you can parse
it like below. This will return a form data array:

.. code-block:: php

    use Pop\Mime\Message;

    $formData = Message::parseForm($formString);

It's important to note that in order for the above example to work properly, it
has to have a header with at least the `Content-Type` defined, including the boundary
that will be used in parsing the form data:

.. code-block:: text

    Content-Type: multipart/form-data;
    	boundary=5bedb090b0b35ce8029464dbec97013c3615cc5a

    --5bedb090b0b35ce8029464dbec97013c3615cc5a
    Content-Disposition: form-data; name="username"

    admin
    --5bedb090b0b35ce8029464dbec97013c3615cc5a
    Content-Disposition: form-data; name="password"

    password
    --5bedb090b0b35ce8029464dbec97013c3615cc5a--

**Create a Multipart Form Message**

You can create a `multipart/form-data` MIME message for HTTP using the `createForm`
method, like below:

.. code-block:: php

    use Pop\Mime\Message;

    $formData = [
        'username' => 'admin@test/whatever%DUDE!',
        'password' => '123456',
        'colors'   => ['Red', 'Green']
    ];

    $formMessage = Message::createForm($formData);
    echo $formMessage();

The above code will create a full `multipart/form-data` MIME message that looks like this:

.. code-block:: text

    Content-Type: multipart/form-data; boundary=43acac9dbd159dd8bccd29289bd66244d5f6b260

    This is a multi-part message in MIME format.
    --43acac9dbd159dd8bccd29289bd66244d5f6b260
    Content-Disposition: form-data; name=username

    admin%40test%2Fwhatever%25DUDE%21
    --43acac9dbd159dd8bccd29289bd66244d5f6b260
    Content-Disposition: form-data; name=password

    123456
    --43acac9dbd159dd8bccd29289bd66244d5f6b260
    Content-Disposition: form-data; name=colors[]

    Red
    --43acac9dbd159dd8bccd29289bd66244d5f6b260
    Content-Disposition: form-data; name=colors[]

    Green
    --43acac9dbd159dd8bccd29289bd66244d5f6b260--

If you wish to alter the message to prep it to send via an HTTP resource like cURL or
a stream, you can do this:

.. code-block:: php

    use Pop\Mime\Message;

    $formData = [
        'username' => 'admin@test/whatever%DUDE!',
        'password' => '123456',
        'colors'   => ['Red', 'Green']
    ];

    $formMessage = Message::createForm($formData);
    $header      = $formMessage->getHeader('Content-Type');
    $formMessage->removeHeader('Content-Type');

    echo $formMessage->render(false);

And that will render just the form data content, removing the top-level header
and the preamble:

.. code-block:: text

    --28fd350696733cf5d2c466383a7e0193a5cfffc3
    Content-Disposition: form-data; name=username

    admin%40test%2Fwhatever%25DUDE%21
    --28fd350696733cf5d2c466383a7e0193a5cfffc3
    Content-Disposition: form-data; name=password

    123456
    --28fd350696733cf5d2c466383a7e0193a5cfffc3
    Content-Disposition: form-data; name=colors[]

    Red
    --28fd350696733cf5d2c466383a7e0193a5cfffc3
    Content-Disposition: form-data; name=colors[]

    Green
    --28fd350696733cf5d2c466383a7e0193a5cfffc3--

**Create Form Data with a File:**

You can also create form data with files in a couple of different ways as well:

*Example 1:*

.. code-block:: php

    $formData = [
        'file'     => [
            'filename'    => __DIR__ . '/test.pdf',
            'contentType' => 'application/pdf'
        ]
    ];

*Example 2:*

.. code-block:: php

    $formData = [
        'file'     => [
            'filename' => 'test.pdf',
            'contents' => file_get_contents(__DIR__ . '/test.pdf')
            'mimeType' => 'application/pdf'
        ]
    ];

In example 1, the file on disk is passed and put into the form data from there.
In example 2, the file contents are explicitly passed to the `contents` key to
set the file data into the form data. Also, for flexibility, the following
case-insensitive keys are acceptable for `Content-Type`:

- Content-Type
- contentType
- Mime-Type
- mimeType
- mime
