pop-console
===========

The `popphp/pop-console` component is a component for integration and managing a console user interface
with your application. It supports the various aspects of the CLI user experience, colorization and prompt input.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-console

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-console": "3.0.*",
        }
    }

Basic Use
---------

In this simple example, we create a script called `pop` and wire it up. First,
we'll create some commands and an option and add them to the console object:

.. code-block:: php

    use Pop\Console\Console;
    use Pop\Console\Command;

    $edit = new Command('edit', Input\Command::VALUE_REQUIRED);
    $edit->setHelp('This is the help screen for the edit command.');

    $console = new Console();
    $console->addCommand($help);
    $console->addCommand($edit);

Once the commands are registered with the main `$console` object, we access
them like so:

.. code-block:: php

    $console->write($console->help('edit'), '    ');
    $console->send();

Using a Prompt
--------------

You can also trigger a prompt to get information from the user. You can enforce
a certain set of options as well as whether or not they are case-sensitive:

.. code-block:: php

    $console = new Pop\Console\Console();
    $letter  = $console->prompt(
        'Which is your favorite letter: A, B, C, or D? ',
        ['A', 'B', 'C', 'D'],
        true
    );
    echo 'Your favorite letter is ' . $letter . '.';


.. code-block:: bash

    ./pop
    Which is your favorite letter: A, B, C, or D? B   // <- User types 'B'
    Your favorite letter is B.
