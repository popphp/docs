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
            "popphp/pop-console": "^3.1.0",
        }
    }

Basic Use
---------

You can use a console object to manage and deploy output to the console, including
a prepended header and appended footer.

.. code-block:: php

    $console = new Pop\Console\Console();
    $console->setHeader('My Application');
    $console->setFooter('The End');
    
    $console->append('Here is some console information.');
    $console->append('Hope you enjoyed it!');
    
    $console->send();

The above will output:

.. code-block:: text

        My Application
    
        Here is some console information.
        Hope you enjoyed it!

        The End

Console Colors
--------------

On consoles that support it, you can colorize text outputted to the console with the
``colorize()`` method:

.. code-block:: php

    $console->append(
        'Here is some ' . 
        $console->colorize('IMPORTANT', Console::BOLD_RED) .
        ' console information.'
    );

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

Help Screen
-----------

You can register commands with the console object to assist in auto-generating
a well-formatted, colorized help screen.

.. code-block:: php

    use Pop\Console\Console;
    use Pop\Console\Command;
    
    $edit = new Command(
        'user edit', '<id>', 'This is the help for the user edit command'
    );
    
    $remove = new Command(
        'user remove', '<id>', 'This is the help for the user remove command'
    );
    
    $console = new Console();
    $console->addCommand($edit);
    $console->addCommand($remove);
    $console->setHelpColors(
        Console::BOLD_CYAN,
        Console::BOLD_GREEN,
        Console::BOLD_YELLOW
    );

Once the commands are registered with the main `$console` object, we can generate
the help screen like this: 

.. code-block:: php

    $console->help();

The above command will output an auto-generated, colorized help screen with the commands
that are registered with the console object.

**Note**

These are basic examples. Ideally, you could wire an application to use the console
but not for setting routes, controllers and actions. Refer to the `Pop PHP Tutorial`_
example application to see how to wire up a CLI-based application using Pop PHP.

.. _Pop PHP Tutorial: https://github.com/popphp/popphp-tutorial
