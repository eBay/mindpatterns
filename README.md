# eBay MIND Patterns - Accessibility Patterns for the Web

**NOTE**: Support for Internet Explorer 10 and below was recently dropped, allowing us more time to focus on accessibility matters, rather than cross-browser issues.

## Local Development

This project uses [Bundler](http://bundler.io) to ensure our local [Jekyll](http://jekyllrb.com) environment matches the GitHub Pages Jekyll environment.

1. To install Bundler, please refer to this short [Requirements](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/#requirements) section over on GitHub Help (you can skip all the other steps on that page and come back here)
1. Clone this project to your local environment, e.g. `git clone https://github.com/ianmcburnie/mindpatterns.git`
1. In your terminal window, change into the project directory you just cloned
1. Notice the project directory contains a Gemfile. It will be used by Bundler in the next step.
1. Run `bundle install` this will install Jekyll and other [dependencies](https://pages.github.com/versions/) from the GitHub Pages gem
1. Run `npm install` to install all devDependencies (e.g. jQuery, Lasso, Makeup)
1. Run `npm start` to build and run site
1. Browser will automatically open at [localhost:3000](http://localhost:3000)
1. Browser will automatically reload when local HTML, JS or CSS assets are modified
