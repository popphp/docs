Get the Tutorial Application
============================

You can get a copy of the Pop PHP Framework tutorial application over via composer or directly
from `Github`_.

**Install via composer:**

.. code-block:: bash

    composer create-project popphp/popphp-tutorial project-folder
    cd project-folder
    sudo php -S localhost:8000 -t public

If you run the commands above, you should be able to see Pop welcome screen in your browser at
the ``http://localhost:8000`` address.

**Install via git:**

You can clone the repository directly and install it and play around with it there:

.. code-block:: bash

    git clone https://github.com/popphp/popphp-tutorial.git
    cd popphp-tutorial
    composer install
    sudo php -S localhost:8000 -t public

Again, running the above commands, you should be able to visit the Pop welcome screen in
your browser.

.. _Github: https://github.com/popphp/popphp-tutorial