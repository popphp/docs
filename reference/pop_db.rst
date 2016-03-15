Pop\\Db
=======

The `popphp/pop-db` component is a database component for interfacing with databases. By default, it provides
adapters for MySQL, PostgreSQL, Oracle, SQLServer and SQLite. Other adapters can be built by extending the core
abstract adapter. The component provides a SQL builder to assist with writing portable standard SQL queries
that can be used across the different database platforms. And, it also provides a record class that services as
an active record/row gateway hybrid. The record sub-component provides easy set up of database tables, along
with an easy API to access the database tables and the data in them.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-db

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-db": "2.0.*",
        }
    }

Basic Use
---------
