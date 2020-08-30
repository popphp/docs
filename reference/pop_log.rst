pop-log
=======

The `popphp/pop-log` component provides basic logging functionality via a few different writers, including
file, mail and database logs.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-log

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-log": "^3.2.0",
        }
    }

Basic Use
---------

The `popphp/pop-log` component  is a logging component that provides a way of logging events following
the standard BSD syslog protocol outlined in `RFC-3164`_. Support is built-in for writing log messages
to a file or database table or deploying them via email. The eight available log message severity values
are:

* EMERG  (0)
* ALERT  (1)
* CRIT   (2)
* ERR    (3)
* WARN   (4)
* NOTICE (5)
* INFO   (6)
* DEBUG  (7)

and are available via their respective methods:

* ``$log->emergency($message);``
* ``$log->alert($message);``
* ``$log->critical($message);``
* ``$log->error($message);``
* ``$log->warning($message);``
* ``$log->notice($message);``
* ``$log->info($message);``
* ``$log->debug($message);``

File
----

Setting up and using a log file is pretty simple. Plain text is the default, but there is also support
for CSV, TSV and XML formats:

.. code-block:: php

    use Pop\Log\Logger;
    use Pop\Log\Writer;

    $log = new Logger(new Writer\File(__DIR__ . '/logs/app.log'));

    $log->info('Just a info message.');
    $log->alert('Look Out! Something serious happened!');

Then, your 'app.log' file will contain:

.. code-block:: text

    2015-07-11 12:32:32    6    INFO    Just a info message.
    2015-07-11 12:32:33    1    ALERT   Look Out! Something serious happened!

Email
-----

Here's an example using email, which requires you to install `popphp/pop-mail`:

.. code-block:: php

    use Pop\Log\Logger;
    use Pop\Log\Writer;
    use Pop\Mail;

    $mailer = new Mail\Mailer(new Mail\Transport\Sendmail());
    $log    = new Logger(new Writer\Mail($mailer, [
        'sysadmin@mydomain.com', 'logs@mydomain.com'
    ]));

    $log->info('Just a info message.');
    $log->alert('Look Out! Something serious happened!');

Then the emails listed above will receive a series of emails like this:

.. code-block:: text

    Subject: Log Entry: INFO (6)
    2015-07-11 12:32:32    6    INFO    Just a info message.

and

.. code-block:: text

    Subject: Log Entry: ALERT (1)
    2015-07-11 12:32:33    1    ALERT   Look Out! Something serious happened!

HTTP
----

Here's an example using an HTTP service:

.. code-block:: php

    use Pop\Log\Logger;
    use Pop\Log\Writer;
    use Pop\Http\Client;

    $stream = new Client\Stream('http://logs.mydomain.com/');
    $log    = new Logger(new Writer\Http($stream);

    $log->info('Just a info message.');
    $log->alert('Look Out! Something serious happened!');

The log writer will send HTTP requests with the log data to the HTTP service.

Database
--------

Writing a log to a table in a database requires you to install `popphp/pop-db`:

.. code-block:: php

    use Pop\Db\Db;
    use Pop\Log\Logger;
    use Pop\Log\Writer;

    $db  = Db::connent('sqlite', __DIR__ . '/logs/.htapplog.sqlite');
    $log = new Logger(new Writer\Db($db, 'system_logs'));

    $log->info('Just a info message.');
    $log->alert('Look Out! Something serious happened!');

In this case, the logs are written to a database table that has the columns
`id`, `timestamp`, `level`, `name` and `message`. So, after the example above,
your database table would look like this:

+----+---------------------+----------+-------+---------------------------------------+
| Id | Timestamp           | Level    | Name  | Message                               |
+====+=====================+==========+=======+=======================================+
| 1  | 2015-07-11 12:32:32 | 6        | INFO  | Just a info message.                  |
+----+---------------------+----------+-------+---------------------------------------+
| 2  | 2015-07-11 12:32:33 | 1        | ALERT | Look Out! Something serious happened! |
+----+---------------------+----------+-------+---------------------------------------+

Log Limits
----------

Log level limits can be set for the log writer objects to enforce the severity of which log messages actually get logged:

.. code-block:: php

    use Pop\Log\Logger;
    use Pop\Log\Writer;

    $prodLog = new Writer\File(__DIR__ . '/logs/app_prod.log');
    $devLog  = new Writer\File(__DIR__ . '/logs/app_dev.log');

    $prodLog->setLogLimit(3); // Log only ERROR (3) and above
    $devLog->setLogLimit(6);  // Log only INFO (6) and above

    $log = new Logger([$prodLog, $devLog]);

    $log->alert('Look Out! Something serious happened!'); // Will write to both writers
    $log->info('Just a info message.');                   // Will write to only app_dev.log


The ``app_prod.log`` file will contain:

.. code-block:: text

    2015-07-11 12:32:33    1    ALERT   Look Out! Something serious happened!

And the ``app_dev.log`` file will contain:

.. code-block:: text

    2015-07-11 12:32:33    1    ALERT   Look Out! Something serious happened!
    2015-07-11 12:32:34    6    INFO    Just a info message.


.. _RFC-3164: http://tools.ietf.org/html/rfc3164