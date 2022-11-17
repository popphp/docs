pop-storage
===========

The `popphp/pop-storage` is a storage wrapper component that provides interchangeable adapters
to easily manage and switch between different storage resources, such as the local disk or a
cloud-based storage platform, like AWS S3.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-storage

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-storage": "^1.0.0"
        }
    }

Basic Use
---------

**Setting up the Local adapter**

.. code-block:: php

    $storage = new Pop\Storage\Local(__DIR__ . '/tmp/');


**Setting up the S3 adapter**

.. code-block:: php

    $storage = new Pop\Storage\S3($_ENV['AWS_BUCKET'], new S3\S3Client([
        'credentials' => [
            'key'    => $_ENV['AWS_KEY'],
            'secret' => $_ENV['AWS_SECRET'],
        ],
        'region'  => $_ENV['AWS_REGION'],
        'version' => $_ENV['AWS_VERSION']
    ]));


**Checking if a file exists**

.. code-block:: php

    if ($storage->fileExists('test.txt')) {
        // File exists
    }


**Fetch contents of a file**

.. code-block:: php

    $fileContents = $storage->fetchFile('test.txt');


**Copy a file**

.. code-block:: php

    $adapter->copyFile('test.txt', 'test2.txt');


**Rename a file**

.. code-block:: php

    $adapter->renameFile('test.txt', 'test1.txt');


**Replace a file**

.. code-block:: php

    $adapter->replaceFile('test1.txt', 'new contents');


**Make a directory**

.. code-block:: php

    $adapter->mkdir('test');


**Remove a directory**

.. code-block:: php

    $adapter->rmdir('test');
