pop-filter
=======

The `popphp/pop-filter` is a component for applying filtering callbacks to multiple values
that need to be consumed by other areas of an application. It can be used for input security
as well general input clean-up as well.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-filter

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-filter": "^3.2.1"
        }
    }

Basic Use
---------

**Simple Filter**

If you want to create a simple, single filter and use it to filter some values, you can do this:

.. code-block:: php

    $filter = new Pop\Filter\Filter('strip_tags');
    $values = [
        'username' => '<b>admin</b>',
        'email'    => '<a href="mailto:test@test.com">test@test.com</a>'
    ];
    $values = $filter->filter($values);

The values above have been filtered and had the tags stripped:

.. code-block:: text

    $values = [
        'username' => 'admin',
        'email'    => 'test@test.com'
    ];

**The Filterable Trait**

The component comes with a trait called ``Pop\Filter\FilterableTrait``. If you wish to have
the filter component and its features wired into your application, you will need to have
a class that uses this trait. With it, your class will be able to add filters and call
the methods to filter the necessary values. These filters can either be an instance of
``Pop\Filter\FilterInterface`` (e.g., ``Pop\Filter\Filter``) or a basic callable.

.. code-block:: php

    namespace MyApp\Model

    use Pop\Filter\FilterableTrait;

    class User
    {

        use FilterableTrait;

        /**
         * Filter values
         *
         * @param  array $values
         * @return array
         */
        public function filter(array $values)
        {
            foreach ($this->filters as $filter) {
                foreach ($values as $key => $value) {
                    $values[$key] = $filter->filter($value, $key);
                }
            }

            return $values;
        }

    }

With the above code, you can create a user model, add filters to it
and filter values with it:

.. code-block:: php

    $user = new User();
    $user->addFilters([
        'strip_tags',
        new Pop\Filter\Filter('htmlentities', [ENT_QUOTES, 'UTF-8']),
    ]);

    $values = [
        'username'   => '<script>"Admin"</script>',
        'first_name' => '<b>John\'s</b>',
        'last_name'  => '<b>Doe</b>'
    ];

    $values = $user->filter($values);

The values are now filtered and look like:

.. code-block:: text

    $values = [
        'username'   => '&quot;Admin&quot;',
        'first_name' => 'John&#039;s',
        'last_name'  => 'Doe'
    ];


The tags have been stripped and the entities have been converted to HTML. Notice the
first filter added was the callable ``strip_tags`` and the second filter added was an
instance of ``Pop\Filter\Filter`` with parameters.

**Fine-Grained Control**

Two properties are available to the ``filter`` method within the ``Pop\Filter\AbstractFilter`` class.
They are ``excludeByName`` and ``excludeByType``. With them, you can have fine-tuned control over
what values actually get filtered. For example, if you don't want to filter any values named
``username``, you can do this:

.. code-block:: php

    $filter = new Pop\Filter\Filter('strip_tags', null, 'username');
    $values = [
        'username' => '<b>admin</b>',
        'email'    => '<a href="mailto:test@test.com">test@test.com</a>'
    ];

    foreach ($values as $key => $value) {
        $values[$key] = $filter->filter($value, $key);
    }

Because of the third parameter in the above constructor, the `username` is excluded from being
filtered and the values look like this:

.. code-block:: text

    $values = [
        'username' => '<b>admin</b>',
        'email'    => 'test@test.com'
    ];

The fourth parameter of the filter constructor is ``$excludeByType`` and that is useful for
excluding a number of values at once that are all of the same type, for example, textareas
within a form object.