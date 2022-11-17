pop-dom
=======

The `popphp/pop-dom` component is a component for generating, rendering and parsing DOM documents
and elements. With it, you can easily create or parse document nodes and their children and have
control over node content and attributes.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-dom

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-dom": "^3.3.1"
        }
    }

Basic Use
---------

The `popphp/pop-dom` component is for generating, rendering and parsing DOM documents and elements.
With it, you can easily create document nodes and their children and have control over node content
and attributes.

**Creating a Simple Node**

.. code-block:: php

    use Pop\Dom\Child;

    $div = new Child('div');
    $h1  = new Child('h1', 'This is a header');
    $p   = new Child('p');
    $p->setNodeValue('This is a paragraph.');

    $div->addChildren([$h1, $p]);

    echo $div;

The above code produces the following HTML:

.. code-block:: html

    <div>
        <h1>This is a header</h1>
        <p class="paragraph">This is a paragraph.</p>
    </div>


Build a DOM Document
--------------------

Putting all of it together, you can build a full DOM document like this:

.. code-block:: php

    // Title element
    $title = new Child('title', 'This is the title');

    // Meta tag
    $meta = new Child('meta');
    $meta->setAttributes([
        'http-equiv' => 'Content-Type',
        'content'    => 'text/html; charset=utf-8'
    ]);

    // Head element
    $head = new Child('head');
    $head->addChildren([$title, $meta]);

    // Some body elements
    $h1 = new Child('h1', 'This is a header');
    $p  = new Child('p', 'This is a paragraph.');

    $div = new Child('div');
    $div->setAttribute('id', 'content');
    $div->addChildren([$h1, $p]);

    // Body element
    $body = new Child('body');
    $body->addChild($div);

    // Html element
    $html = new Child('html');
    $html->addChildren([$head, $body]);

    // Create and render the DOM document with HTTP headers
    $doc = new Document(Document::HTML, $html);
    echo $doc;

Which produces the following HTML:

.. code-block:: html

    <!DOCTYPE html>
    <html>
        <head>
            <title>This is the title</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        </head>
        <body>
            <div id="content">
                <h1>This is a header</h1>
                <p>This is a paragraph.</p>
            </div>
        </body>
    </html>

Parsing a DOM Document
----------------------

You can parse from a string of XML or HTML and it will return an object graph of Child elements
that you can further manipulate or edit to then output:

.. code-block:: php

    $html = <<<HTML
    <html>
        <head>
            <title>Hello World Title</title>
        </head>
        <body>
            <h1 class="top-header" id="header">Hello World Header</h1>
            <p>How are <em>YOU</em> doing <strong><em>today</em></strong>???</p>
            <p class="special-p">Some <strong class="bold">more</strong> text.</p>
        </body>
    </html>
    HTML;

    $doc = new Document(Document::HTML);
    $doc->addChild(Child::parseString($html));
    echo $doc;

And you can parse from a file as well:

.. code-block:: php

    $children = Child::parseFile('index.html');

