pop-console
===========

The `popphp/pop-console` component is a component for integration and managing a console user interface
with your application. It supports the various aspect of the CLI user experience, including commands and
options, as well as colorization and prompt input.

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
    use Pop\Console\Input;

    $name = new Input\Option('-n|--name', Input\Option::VALUE_REQUIRED);

    $help = new Input\Command('help');
    $help->setHelp('This is the general help screen.');

    $edit = new Input\Command('edit', Input\Command::VALUE_REQUIRED);
    $edit->setHelp('This is the help screen for the edit command.');

    $console = new Console();
    $console->addOption($name);
    $console->addCommand($help);
    $console->addCommand($edit);

Once the commands and options are registered with the main `$console` object, we
can parse the incoming CLI request, check if it's valid and correctly route it:

.. code-block:: php

    $console->parseRequest();

    if ($console->isRequestValid()) {
        if ($console->request()->hasCommand('edit')) {
            $value = $console->getCommand('edit')->getValue();
            switch ($value) {
                case 'help':
                    $help = $console->colorize(
                        $console->getCommand('edit')->getHelp(), Console::BOLD_YELLOW
                    );
                    $console->write($help);
                    $console->send();
                    break;
                default:
                    $console->write('You have selected to edit ' . $value);
                    if ($console->request()->hasOption('--name')) {
                        $console->write(
                            'You have added the name option of ' .
                                $console->getOption('--name')->getValue()
                        );
                    }
                    $console->send();
            }
        } else if ($console->request()->hasCommand('help')) {
            $help = $console->colorize(
                $console->getCommand('help')->getHelp(), Console::BOLD_YELLOW
            );
            $console->write($help);
            $console->send();
        } else {
            $console->write(
                $console->colorize('The command was not recognized.', Console::BOLD_RED)
            );
            $console->send();
        }
    } else {
        $console->write(
            $console->colorize('The command was not valid.', Console::BOLD_RED)
        );
        $console->send();
    }

Then, we can run the following valid commands:

.. code-block:: bash

    ./pop help
    This is the general help screen.

    ./pop edit users
    You have selected to edit users

    ./pop edit users --name=bob
    You have selected to edit users
    You have added the name option of bob

    ./pop edit help
    This is the help screen for the edit command.

And, any of these invalid commands will produce the error output:

.. code-block:: bash

    ./pop badcommand
    The command was not recognized.

    ./pop edit
    The command was not valid.

The last example is not value because we made the argument value of
the `edit` command required.

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
