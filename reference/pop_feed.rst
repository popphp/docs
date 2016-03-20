Pop\\Feed
=========

The `popphp/pop-feed` component manages the creation and parsing of standard web feeds.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-feed

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-feed": "2.0.*",
        }
    }

Basic Use
---------

Creating a Feed
~~~~~~~~~~~~~~~

To generate a feed, you would set up the feed object and its items like this:

.. code-block:: php

    use Pop\Feed\Writer;

    $headers = [
        'published' => date('Y-m-d H:i:s'),
        'author'    => 'Test Author'
    ];

    $items = [
        [
            'title'       => 'Some Item #1',
            'link'        => 'http://www.popphp.org/',
            'description' => 'This is the description of item #1',
            'published'   => date('Y-m-d H:i:s')
        ],
        [
            'title'       => 'Some Item #2',
            'link'        => 'http://popcorn.popphp.org/',
            'description' => 'This is the description of item #2',
            'published'   => date('Y-m-d H:i:s')
        ]
    ];

    $feed = new Writer($headers, $items);
    $feed->render();

which would render like this:

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8"?>
    <rss version="2.0"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:wfw="http://wellformedweb.org/CommentAPI/">
        <channel>
            <published>Tue, 21 Jul 2015 18:09:08 -0500</published>
            <author>Test Author</author>
            <item>
                <title>Some Item #1</title>
                <link>http://www.popphp.org/</link>
                <description>This is the description of item #1</description>
                <published>Tue, 21 Jul 2015 18:09:08 -0500</published>
            </item>
            <item>
                <title>Some Item #2</title>
                <link>http://popcorn.popphp.org/</link>
                <description>This is the description of item #2</description>
                <published>Tue, 21 Jul 2015 18:09:08 -0500</published>
            </item>
        </channel>
    </rss>

In the above example, you can set it to render as an ATOM feed instead:

.. code-block:: php

    $feed = new Writer($headers, $items);
    $feed->setAtom();
    $feed->render();

and it would render like this instead:

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
        <published>Tue, 21 Jul 2015 18:10:39 -0500</published>
        <author>
            <name>Test Author</name>
        </author>
        <entry>
            <title>Some Item #1</title>
            <link href="http://www.popphp.org/" />
            <description>This is the description of item #1</description>
            <published>Tue, 21 Jul 2015 18:10:39 -0500</published>
        </entry>
        <entry>
            <title>Some Item #2</title>
            <link href="http://popcorn.popphp.org/" />
            <description>This is the description of item #2</description>
            <published>Tue, 21 Jul 2015 18:10:39 -0500</published>
        </entry>
    </feed>

Parsing a Feed
~~~~~~~~~~~~~~

If the feed is an RSS feed, you would do this:

.. code-block:: php

    use Pop\Feed\Reader;
    use Pop\Feed\Format\Rss;

    $feed = new Reader(new Rss('http://www.domain.com/rss'));

    foreach ($feed->items as $item) {
        print_r($item);
    }

If the feed is an ATOM feed, you would do this instead:

.. code-block:: php

    use Pop\Feed\Reader;
    use Pop\Feed\Format\Atom;

    $feed = new Reader(new Atom('http://www.domain.com/feed'));

    foreach ($feed->entries as $entry) {
        print_r($entry);
    }
