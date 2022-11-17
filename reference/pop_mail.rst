pop-mail
========

The `popphp/pop-mail` component provides an API to manage sending mail from your application.
Support is built-in for multi-mimetype emails and attachments, as well as multiple recipients and
queuing. It has a full feature set that supports:

* Send to email via sendmail, SMTP or any custom-written mail transport adapters
* Send emails to a queue of recipients, with individual message customization
* Save emails to be sent later
* Retrieve and manage emails from email mailboxes.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-mail

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-mail": "^3.6.1"
        }
    }

**A Note about SMTP**

The SMTP transport component within `pop-mail` is forked from and built on top of the SMTP features and
functionality of the `Swift Mailer Library`_ and the great work the Swift Mailer team has accomplished
over the past years.

Basic Use
---------

Here's an example sending a basic email using ``sendmail``:

.. code-block:: php

    use Pop\Mail;

    $transport = new Mail\Transport\Sendmail();

    $mailer = new Mail\Mailer($transport);

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');
    $message->attachFile(__DIR__ . '/image.jpg');
    $message->setBody('Hello World! This is a test!');

    $mailer->send($message);

Here's an example sending a basic email using SMTP (MS Exchange):

.. code-block:: php

    use Pop\Mail;

    $transport = new Mail\Transport\Smtp('mail.msdomain.com', 587);
    $transport->setUsername('me')
        ->setPassword('password');

    $mailer = new Mail\Mailer($transport);

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');
    $message->attachFile(__DIR__ . '/image.jpg');
    $message->setBody('Hello World! This is a test!');

    $mailer->send($message);

Here's an example sending a basic email using SMTP (Gmail Exchange):

.. code-block:: php

    use Pop\Mail;

    $transport = new Mail\Transport\Smtp('smtp.gmail.com', 587, 'tls');
    $transport->setUsername('me@mydomain.com')
        ->setPassword('password');

    $mailer = new Mail\Mailer($transport);

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');
    $message->attachFile(__DIR__ . '/image.jpg');
    $message->setBody('Hello World! This is a test!');

    $mailer->send($message);

Attaching a File
----------------

.. code-block:: php

    use Pop\Mail;

    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');

    $message->attachFile('my-file.txt');
    $message->setBody('Hello World! This is a test!');

    $mailer->send($message);

Attaching a File from Data
----------------

.. code-block:: php

    use Pop\Mail;

    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');

    $fileData = file_get_contents('my-file.txt');

    $message->attachFileFromStream($fileData, 'my-file.txt');
    $message->setBody('Hello World! This is a test!');

    $mailer->send($message);

Sending an HTML/Text Email
--------------------------

.. code-block:: php

    use Pop\Mail;
    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');

    $message->addText('Hello World! This is a test!');
    $message->addHtml('<html><body><h1>Hello World!</h1><p>This is a test!</p></body></html>');

    $mailer->send($message);

Sending Emails to a Queue
-------------------------

.. code-block:: php

    use Pop\Mail;

    $queue = new Queue();
    $queue->addRecipient([
        'email'   => 'me@domain.com',
        'name'    => 'My Name',
        'company' => 'My Company',
        'url'     => 'http://www.domain1.com/'
    ]);
    $queue->addRecipient([
        'email'   => 'another@domain.com',
        'name'    => 'Another Name',
        'company' => 'Another Company',
        'url'     => 'http://www.domain2.com/'
    ]);

    $message = new Mail\Message('Hello [{name}]!');
    $message->setFrom('noreply@domain.com');
    $message->setBody(
    <<<TEXT
    How are you doing? Your [{company}] is great!
    I checked it out at [{url}]
    TEXT
    );

    $queue->addMessage($message);

    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());
    $mailer->sendFromQueue($queue);

Saving an Email to Send Later
-----------------------------

.. code-block:: php

    use Pop\Mail;

    $message = new Mail\Message('Hello World');
    $message->setTo('you@domain.com');
    $message->setFrom('me@domain.com');

    $message->addText('Hello World! This is a test!');
    $message->addHtml('<html><body><h1>Hello World!</h1><p>This is a test!</p></body></html>');

    $message->save(__DIR__ . '/mailqueue/test.msg');

    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());
    $mailer->sendFromDir(__DIR__ . '/mailqueue');

Retrieving Emails from a Client
-------------------------------

.. code-block:: php

    use Pop\Mail\Client;

    $imap = new Client\Imap('imap.gmail.com', 993);
    $imap->setUsername('me@domain.com')
         ->setPassword('password');

    $imap->setFolder('INBOX');
    $imap->open('/ssl');

    // Sorted by date, reverse order (newest first)
    $ids     = $imap->getMessageIdsBy(SORTDATE, true);
    $headers = $imap->getMessageHeadersById($ids[0]);
    $parts   = $imap->getMessageParts($ids[0]);

    // Assuming the first part is an image attachement, display image
    header('Content-Type: image/jpeg');
    header('Content-Length: ' . strlen($parts[0]->content));
    echo $parts[0]->content;

.. _Swift Mailer Library: https://github.com/swiftmailer/swiftmailer