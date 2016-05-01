Pop\\Shipping
=============

The `popphp/pop-shipping` component is a robust shipping gateway component that provides a normalized
API that works across several different shipping adapters. Other adapters can be built and utilized as well.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-shipping

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-shipping": "2.0.*",
        }
    }

Basic Use
---------

The built-in shipping adapters are:

* UPS
* Fedex
* USPS

And of course, any shipping adapter uses would require a registered account with the shipping vendor.

FedEx
~~~~~

The FedEx API utilizes SOAP, so you'll have to obtain a copy of the WSDL file and
point to its location on your sever:

.. code-block:: php

    use Pop\Shipping\Shipping;
    use Pop\Shipping\Adapter\Fedex;

    $shipping = new Shipping(
        new Fedex('USER_KEY', 'PASSWORD', 'ACCOUNT_NUM', 'METER_NUM', 'WSDL_FILE')
    );

UPS
~~~

The UPS API utilizes basic XML under the hood:

.. code-block:: php

    use Pop\Shipping\Shipping;
    use Pop\Shipping\Adapter\Ups;

    $shipping = new Shipping(
        new Ups('ACCESS_KEY', 'USER_ID', 'PASSWORD')
    );

US Post Office
~~~~~~~~~~~~~~

The US Post Office API utilizes basic XML under the hood as well:

.. code-block:: php

    use Pop\Shipping\Shipping;
    use Pop\Shipping\Adapter\Usps;

    $shipping = new Shipping(
        new Usps('USERNAME', 'PASSWORD')
    );

Get Rates
---------

.. code-block:: php

    use Pop\Shipping\Shipping;
    use Pop\Shipping\Adapter\Ups;

    $shipping = new Shipping(
        new Ups('ACCESS_KEY', 'USER_ID', 'PASSWORD')
    );

    // Set the 'ship to' address
    $shipping->shipTo([
        'address' => '123 Main St.',
        'city'    => 'Some Town',
        'state'   => 'LA',
        'zip'     => '12345',
        'country' => 'US'
    ]);

    // Set the 'ship from' address
    $shipping->shipFrom([
        'company'  => 'Widgets Inc',
        'address1' => '456 Some St.',
        'address2' => 'Suite 100',
        'city'     => 'Some Town',
        'zip'      => '12345',
        'country'  => 'US'
    ]);

    // Set the package dimensions
    $shipping->setDimensions([
        'length' => 12,
        'height' => 10,
        'width'  => 8
    ], 'IN');

    // Set the package weight
    $shipping->setWeight(5.4, 'LBS');

    // Go get the rates
    $shipping->send();

    if ($shipping->isSuccess()) {
        foreach ($shipping->getRates() as $service => $rate) {
            echo $service . ': ' . $rate . PHP_EOL;
        }
    }

The above example will output something like:

.. code-block:: text

    Next Day Air: $36.70
    2nd Day Air: $28.84
    3 Day Select: $22.25
    Ground: $17.48
