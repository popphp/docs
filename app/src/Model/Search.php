<?php

namespace Pop\Docs\Model;

use Pop\Model\AbstractModel;
use Pop\Dir\Dir;

class Search extends AbstractModel
{

    public function search(string $query, string $version): array
    {
        $results = [];
        $omit    = [
            'error.phtml',
            'exception.phtml',
            'search.phtml',
            'inc/breadcrumb.phtml',
            'inc/footer.phtml',
            'inc/header.phtml',
            'inc/nav.phtml',
        ];

        $dir = new Dir(__DIR__ . '/../../view' . $version, [
            'recursive' => true,
            'relative' => true,
            'filesOnly' => true
        ]);

        $files = $dir->getFiles();

        foreach ($files as $file) {
            if (!in_array($file, $omit)) {
                $contents = strip_tags(file_get_contents(__DIR__ . '/../../view' .$version . '/' . $file));
                if ((stripos($contents, $query) !== false) || (stripos($file, $query) !== false)) {
                    $uri   = $version . '/' . str_replace(['index', '.phtml'], ['/', ''], $file);
                    $title = ($file == 'index.phtml') ?
                        'Home' : ucwords(str_replace('-', ' ', substr($uri, (strrpos($uri, '/') + 1))));

                    $pos    = stripos($contents, $query);
                    $preview = ($pos > 25) ? substr($contents, $pos - 25, 150) : substr($contents, 0, 150);

                    $results[$uri] = [
                        'title'   => $title,
                        'preview' => str_ireplace($query, '<strong>' . $query . '</strong>', $preview)
                    ];
                }
            }
        }

        return $results;
    }

}