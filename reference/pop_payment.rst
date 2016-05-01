Pop\\Payment
============

The `popphp/pop-payment` component is a robust payment gateway component that provides a normalized
API that works across several different payment gateway adapters. Other adapters can be built and
utilized as well.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-payment

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-payment": "2.0.*",
        }
    }

Basic Use
---------

Currently, the built-in supported vendors are:

* Authorize.net
* PayLeap
* PayPal
* TrustCommerce
* USAEPay

And of course, any payment adapter uses would require a registered account with the payment vendor.

The main idea is the "normalize" the the fields across the adapters so that the main interface has
common fields that are "translated" into the fields required for the selected adapter's API. So,
instead of having to worry that Authorize.net's credit card field is called ``x_card_num`` and
USAEPay's credit card field is ``UMcard``, you just need to worry about the field ``cardNum``
and it'll be mapped correctly to the adapter. The main common fields are:

+-----------------------------------------------------+
|                   Common Fields                     |
+=================+=================+=================+
| amount          | city            | shipToLastName  |
+-----------------+-----------------+-----------------+
| cardNum         | state           | shipToCompany   |
+-----------------+-----------------+-----------------+
| expDate         | zip             | shipToAddress   |
+-----------------+-----------------+-----------------+
| ccv             | country         | shipToCity      |
+-----------------+-----------------+-----------------+
| firstName       | phone           | shipToState     |
+-----------------+-----------------+-----------------+
| lastName        | fax             | shipToZip       |
+-----------------+-----------------+-----------------+
| company         | email           | shipToCountry   |
+-----------------+-----------------+-----------------+
| address         | shipToFirstName |                 |
+-----------------+-----------------+-----------------+

*Creating a payment object*

.. code-block:: php

    use Pop\Payment\Payment;
    use Pop\Payment\Adapter\Authorize;

    $payment = new Payment(new Authorize('API_LOGIN_ID', 'TRANSACTION_KEY'));

*Using the payment object to process a transaction*

.. code-block:: php

    $payment->amount    = 41.51;
    $payment->cardNum   = '4111111111111111';
    $payment->expDate   = '03/17';

    $payment->firstName = 'Test';
    $payment->lastName  = 'Person';
    $payment->company   = 'Test Company';
    $payment->address   = '123 Main St.';
    $payment->city      = 'New Orleans';
    $payment->state     = 'LA';
    $payment->zip       = '70124';
    $payment->country   = 'US';

    $payment->shippingSameAsBilling();

    $payment->send();

    if ($payment->isApproved()) {
        // Approved
    } else if ($payment->isDeclined()) {
        // Declined
    } else if ($payment->isError()) {
        // Some other unknown error
        echo $payment->getMessage();
    }

