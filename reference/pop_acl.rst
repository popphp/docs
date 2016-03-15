Pop\\Acl
========

The `popphp/pop-acl` component is an authorization and access control component the serves as a
hybrid between standard ACL and RBAC user access concepts. Beyond allowing or denying basic user
access, it provides support for roles, resources, inherited permissions and also assertions for
fine-grain access control.

It is not to be confused with the authentication component, as that deals with whether or not
a user is whom they claim they are (identity) and not about the resources to which they may or
may not have access.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-acl

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-acl": "2.0.*",
        }
    }

Basic Use
---------

Inheritance
-----------

Assertions
----------