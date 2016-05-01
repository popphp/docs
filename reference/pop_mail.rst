Pop\\Mail
=========

The `popphp/pop-mail` component provides an API to manage sending mail from your application.
Support is built-in for multi-mimetype emails and attachments, as well as multiple recipients and
queuing. It has a full feature set that supports:

* Send to multiple emails
* Send as group
* Manage headers
* Attach files
* Send multiple mime-types (i.e., text, HTML, etc.)
* Save emails to be sent later

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-mail

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-mail": "2.0.*",
        }
    }

Basic Use
---------

Here's an example sending a basic email:

.. code-block:: php

    use Pop\Mail\Mail;

    $mail = new Mail('Test Email Subject');

    $mail->to('test@test.com');
    $mail->cc('cc@test.com');
    $mail->from('somebody@test.com');

    $mail->setText('Hello World! This is a test email.');

    $mail->send();

And the email sent would look like this:

.. code-block:: text

    To: test@test.com
    Subject: Test Email Subject
    Cc: cc@test.com
    From: somebody@test.com
    Reply-To: somebody@test.com
    Content-Type: text/plain; charset=utf-8

    Hello World! This is a test email.

Attaching a File
----------------

.. code-block:: php

    use Pop\Mail\Mail;

    $mail = new Mail('Attaching a File');

    $mail->to('test@test.com');
    $mail->from('somebody@test.com');

    $mail->setText('Check out this file.');
    $mail->attachFile('lorem.docx');

    $mail->send();

.. code-block:: text

    To: test@test.com
    Subject: Attaching a File
    From: somebody@test.com
    Reply-To: somebody@test.com
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="7dbf357ee8df3d00a00cda688da71a8523f8123c"
    This is a multi-part message in MIME format.

    --7dbf357ee8df3d00a00cda688da71a8523f8123c
    Content-Type: file; name="lorem.docx"
    Content-Transfer-Encoding: base64
    Content-Description: lorem.docx
    Content-Disposition: attachment; filename="lorem.docx"

    UEsDBBQACAgIAKmB9UYAAAAAAAAAAAAAAAALAAAAX3JlbHMvLnJlbHOtkk1LA0EMhu/9FUPu3Wwr
    iMjO9iJCbyL1B4SZ7O7Qzgczaa3/3kEKulCKoMe8efPwHNJtzv6gTpyLi0HDqmlBcTDRujBqeNs9
    [ ... Big long block of base 64 encoded data ... ]
    L2NvcmUueG1sUEsBAhQAFAAICAgAqYH1RhkaEIMtAQAAXgQAABMAAAAAAAAAAAAAAAAAcRAAAFtD
    b250ZW50X1R5cGVzXS54bWxQSwUGAAAAAAkACQA8AgAA3xEAAAAA


    --7dbf357ee8df3d00a00cda688da71a8523f8123c
    Content-type: text/plain; charset=utf-8

    Check out this file.

    --7dbf357ee8df3d00a00cda688da71a8523f8123c--



Sending an HTML/Text Email
--------------------------

.. code-block:: php

    $mail = new Mail('Sending an HTML Email');

    $mail->to('test@test.com');
    $mail->from('somebody@test.com');

    $html = <<<HTML
    <html>
    <head>
    <title>Hello World!</title>
    </head>
    <body>
    <h1>Hello World!</h1>
    <p>This is a cool HTML email, huh?</p>
    </body>
    </html>
    HTML;

    $mail->setHtml($html);
    $mail->setText(
        'This is the text message in case your email client cannot display HTML.'
    );

    $mail->send();

.. code-block:: text

    To: test@test.com
    Subject: Sending an HTML Email
    From: somebody@test.com
    Reply-To: somebody@test.com
    MIME-Version: 1.0
    Content-Type: multipart/alternative; boundary="d08ae99249fe6d0a03a8436ce3bea4ceffd208cb"
    This is a multi-part message in MIME format.

    --d08ae99249fe6d0a03a8436ce3bea4ceffd208cb
    Content-type: text/plain; charset=utf-8

    This is the text message in case your email client cannot display HTML.

    --d08ae99249fe6d0a03a8436ce3bea4ceffd208cb
    Content-type: text/html; charset=utf-8

    <html>
    <head>
    <title>Hello World!</title>
    </head>
    <body>
    <h1>Hello World!</h1>
    <p>This is a cool HTML email, huh?</p>
    </body>
    </html>

    --d08ae99249fe6d0a03a8436ce3bea4ceffd208cb--

Saving an Email to Send Later
-----------------------------

.. code-block:: php

    use Pop\Mail\Mail;

    $mail = new Mail('Test Email Subject');

    $mail->to('test@test.com');
    $mail->cc('cc@test.com');
    $mail->from('somebody@test.com');

    $mail->setText('Hello World! This is a test email.');
    $mail->saveTo(__DIR__ . '/email-queue');

That will write the email or emails to a file in the folder.
Then, when you're ready to send them, you can simply do this:

.. code-block:: php

    use Pop\Mail\Mail;

    $mail = new Mail();
    $mail->sendFrom(__DIR__ . '/email-queue', true);

The ``true`` parameter is the flag to delete the email from the folder once it's sent.
