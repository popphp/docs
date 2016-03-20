Pop\\Code
=========

The `popphp/pop-code` component is a code generation and reflection component that provides an
API to generate and save PHP code, as well as utilize reflection to parse existing code and
modify and build on it.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-code

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-code": "2.0.*",
        }
    }

Basic Use
---------

Here's an example to create a class with a property and a method:

.. code-block:: php

    use Pop\Code\Generator;

    // Create the class object and give it a namespace
    $class = new Generator('MyClass.php', Generator::CREATE_CLASS);
    $class->setNamespace(new Generator\NamespaceGenerator('MyApp'));

    // Create a new protected property with a default value
    $prop = new Generator\PropertyGenerator('foo', 'string', 'bar', 'protected');

    // Create a method and give it an argument, body and docblock description
    $method = new Generator\MethodGenerator('setFoo', 'public');
    $method->addArgument('foo')
           ->setBody('$this->foo = $foo;')
           ->setDesc('This is the method to set foo.');

    // Add the property and the method to the class code object
    $class->code()->addProperty($prop);
    $class->code()->addMethod($method);

    // Save the class file
    $class->save();

    // Or, you can echo out the contents of the code directly
    echo $class;

The newly created class will look like:

.. code-block:: php

    <?php
    /**
     * @namespace
     */
    namespace MyApp;

    class MyClass
    {

        /**
         * @var   string
         */
        protected $foo = 'bar';


        /**
         * This is the method to set foo.
         */
        public function setFoo($foo)
        {
            $this->foo = $foo;

        }

    }

And here's an example using the existing code from above and adding a method to it.
The reflection object provides you with a code generator object like the one above
so that you can add or remove things from the parsed code:

.. code-block:: php

    use Pop\Code\Generator;
    use Pop\Code\Reflection;

    $class = new Reflection('MyApp\MyClass');

    // Create the new method that you want to add to the existing class
    $method = new Generator\MethodGenerator('hasFoo', 'public');
    $method->addArgument('foo')
           ->setBody('return (null !== $this->foo);')
           ->setDesc('This is the method to see if foo is set.');

    // Access the generator and it's code object to add the new method to it
    $reflect->generator()->code()->addMethod($method);

    // Echo out the code
    echo $reflect->generator();

The modified class, with the new method, will look like:

.. code-block:: php

    <?php
    /**
     * @namespace
     */
    namespace MyApp;

    class MyClass implements
    {

        /**
         *
         * @var   string
         */
        protected $foo = 'bar';

        /**
         * This is the method to set foo.
         */
        public function setFoo($foo)
        {
            $this->foo = $foo;
        }

        /**
         * This is the method to see if foo is set.
         */
        public function hasFoo($foo)
        {
            return (null !== $this->foo);

        }

    }
