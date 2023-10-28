import sys, os
from sphinx.highlighting import lexers
from pygments.lexers.web import PhpLexer

sys.path.append(os.path.abspath('_exts'))

extensions = [
  'sphinx_rtd_theme',
]
html_theme = 'sphinx_rtd_theme'
master_doc = 'index'
highlight_language = 'php'

project = u'Pop PHP Framework'
copyright = u'2009-2024 NOLA Interactive'

version = '5'
release = '5.0.0'

lexers['php'] = PhpLexer(startinline=True)

