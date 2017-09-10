pop-cache
=========

The `popphp/pop-cache` component is a caching component that provides different adapters
to cache data and have it persist for a certain length of time.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-cache

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-cache": "3.2.*",
        }
    }

Basic Use
---------

Each adapter object can be created and passed configuration parameters specific to that adapter:

APC
~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create an APC cache adapter object, with a 5 minute lifetime
    $apcCache = new Adapter\Apc(300);

File
~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a file cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\File('/path/to/my/cache/dir', 300);

Memcache
~~~~~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a Memcache cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\Memcache(300);

Memcached
~~~~~~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a Memcached cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\Memcached(300);

Redis
~~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a Redis cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\Redis(300);

Session
~~~~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a session cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\Session(300);

SQLite
~~~~~~

.. code-block:: php

    use Pop\Cache\Adapter;

    // Create a database cache adapter object, with a 5 minute lifetime
    $cacheAdapter = new Adapter\Sqlite('/path/to/my/.htcachedb.sqlite', 300);

You can then pass any of the above cache adapter objects into the main cache object
to begin storing and recalling data.

.. code-block:: php

    use Pop\Cache\Cache;

    $cache = new Cache($cacheAdapter);

    // Save some data to the cache
    $cache->saveItem('foo', $myData);

    // Recall that data later in the app.
    // Returns false is the data does not exist or has expired.
    $foo = $cache->getItem('foo');

To remove data from cache, you call the ``deleteItem`` method:

.. code-block:: php

    $cache->deleteItem('foo');

And to clear all data from cache, you call the ``clear`` method:

.. code-block:: php

    $cache->clear();

