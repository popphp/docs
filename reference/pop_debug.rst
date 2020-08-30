pop-debug
=========

The `popphp/pop-debug` is a simple debugging component that can be used to hooked into an application to track
certain aspects of the application's lifecycle.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-debug

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-debug": "^1.2.0",
        }
    }

Basic Use
---------

The debugger supports a number of handlers that can record various events during an application's lifecycle.
The provided handlers are:

- **ExceptionHandler**
    + Capture exceptions thrown by the application
- **MemoryHandler**
    + Capture memory usage and peak memory usage
- **MessageHandler**
    + Capture messages at various points in the application's lifecycle
- **QueryHandler**
    + Capture database queries and their parameters and information
- **RequestHandler**
    + Capture information about the current request
- **TimeHandler**
    + Trigger a timer to time the current request or a part of the request.

Also, the debugger supports a few storage methods to storage the debug data after the request is complete:

- File
- SQLite Database
- Redis

Setting up the debugger
-----------------------

.. code-block:: php

    use Pop\Debug;

    $debugger = new Debug\Debugger();
    $debugger->addHandler(new Debug\Handler\MessageHandler());
    $debugger->setStorage(new Debug\Storage\File('log'));

    $debugger['message']->addMessage('Hey! Something happened!');

    $debugger->save();

The above code will save the following output to the `log` folder in a plain text file:

.. code-block:: text

    1504213206.00000	Hey! Something happened!


Setting up multiple handlers
----------------------------

You can configure multiple handlers to capture different points of data within the application:

.. code-block:: php

    use Pop\Debug;

    $debugger = new Debug\Debugger();
    $debugger->addHandler(new Debug\Handler\MessageHandler())
        ->addHandler(new Debug\Handler\ExceptionHandler())
        ->addHandler(new Debug\Handler\RequestHandler())
        ->addHandler(new Debug\Handler\MemoryHandler())
        ->addHandler(new Debug\Handler\TimeHandler());
    $debugger->setStorage(new Debug\Storage\File('log'));

    $debugger['message']->addMessage('Hey! Something happened!');
    $debugger['exception']->addException(new \Exception('Whoops!'));
    $debugger['memory']->updateMemoryUsage();
    $debugger['memory']->updatePeakMemoryUsage();

    $debugger->save();

In the above example, if the debugger is exposed as a service throughout the application,
then you can access it and call those methods above for the individual handlers to capture
the things you need to examine.

Storage formats
---------------

The storage object allows you to store the debug data in the following formats:

- Plain text
- JSON
- Serialized PHP

.. code-block:: php

    $debugger = new Debug\Debugger();
    $debugger->addHandler(new Debug\Handler\MessageHandler());
    $debugger->setStorage(new Debug\Storage\File('log', 'json'));

Query handler
-------------

The query handler is a special handler that ties into the `pop-db` component and the
profiler available with that component. It allows you to capture any database queries
and any information associated with them.

You can set up the query handler like this:

.. code-block:: php

    use Pop\Debug;
    use Pop\Db;

    $db = Db\Db::mysqlConnect([
        'database' => 'popdb',
        'username' => 'popuser',
        'password' => '12pop34'
    ]);

    $queryHandler = $db->listen('Pop\Debug\Handler\QueryHandler');

    $debugger = new Debug\Debugger();
    $debugger->addHandler($queryHandler);
    $debugger->setStorage(new Debug\Storage\File('log'));

    // Run DB queries...

    $debugger->save();

So with the query handler attached to the database adapter object, any and all queries
that are executed will be recorded by the debugger's query handler.