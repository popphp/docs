Pop\\Data
=========

The `popphp/pop-data` component is a component for managing and converting various basic data types,
such as CSV, JSON, SQL, XML and YAML.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-data

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-data": "2.0.*",
        }
    }

Basic Use
---------

The `popphp/pop-data` component provides a streamlined way to convert common data types. With it,
you can easily give it some native PHP data and quickly produce a serialized version of that data
in a common data type, such as CSV, JSON, SQL, XML or YAML. Or, conversely, you can give it some
serialized data, an it will auto-detect the format and convert it to native PHP data.

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

    $data = new Pop\Data\Data($phpData);

    $csvString   = $data->serialize('csv');
    $jsonString  = $data->serialize('json');
    $sqlString   = $data->serialize('sql');
    $xmlString   = $data->serialize('xml');
    $yamlString  = $data->serialize('yaml');

The $csvString variable now contains:

.. code-block:: csv

    first_name,last_name
    Bob,Smith
    Jane,Smith

The $jsonString variable now contains:

.. code-block:: json

    [
        {
            "first_name": "Bob",
            "last_name": "Smith"
        },
        {
            "first_name": "Jane",
            "last_name": "Smith"
        }
    ]

The $sqlString variable now contains:

.. code-block:: sql

    INSERT INTO data (first_name, last_name) VALUES
    ('Bob', 'Smith'),
    ('Jane', 'Smith');

The $xmlString variable now contains:

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8"?>
    <data>
      <row>
        <first_name>Bob</first_name>
        <last_name>Smith</last_name>
      </row>
      <row>
        <first_name>Jane</first_name>
        <last_name>Smith</last_name>
      </row>
    </data>

The $yamlString variable now contains:

    ---
    - first_name: Bob
      last_name: Smith
    - first_name: Jane
      last_name: Smith
    ...
