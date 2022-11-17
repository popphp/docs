pop-csv
=======

The `popphp/pop-csv` component is a component for managing CSV data and files.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-csv

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-csv": "^3.2.1"
        }
    }

Basic Use
---------

The `popphp/pop-csv` component provides a streamlined way to work with PHP data and the CSV format.

Serialize Data
~~~~~~~~~~~~~~

To serialize the data into one of the data types, you can create a data object and call the
``serialize()`` method:

.. code-block:: php

    $phpData = [
        [
            'first_name' => 'Bob',
            'last_name'  => 'Smith'
        ],
        [
            'first_name' => 'Jane',
            'last_name'  => 'Smith'
        ]
    ];

    $data = new Pop\Csv\Csv($phpData);

    $csvString   = $data->serialize();

The ``$csvString`` variable now contains:

.. code-block:: csv

    first_name,last_name
    Bob,Smith
    Jane,Smith

Unserialize Data
~~~~~~~~~~~~~~~~

You can either pass the data object a direct string of serialized data or a file containing a
string of serialized data. It will detect which one it is and parse it accordingly.

.. code-block:: php

    $csv = new Pop\Csv\Csv($csvString);
    // OR
    $csv = new Pop\Csv\Csv('/path/to/file.csv');

    $phpData = $csv->unserialize();

Write to File
~~~~~~~~~~~~~

.. code-block:: php

    $data = new Pop\Csv\Csv($phpData);
    $data->serialize();
    $data->writeToFile('/path/to/file.csv');

Output to HTTP
~~~~~~~~~~~~~~

.. code-block:: php

    $data = new Pop\Csv\Csv($phpData);
    $data->serialize();
    $data->outputToHttp();

If you want to force a download, you can set that parameter:

.. code-block:: php

    $data->outputToHttp('my-file.csv', true);
