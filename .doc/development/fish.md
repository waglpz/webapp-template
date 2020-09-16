## Development in fish

### Install fish
Installation routine you can see on https://fishshell.com/
##### on Ubuntu/Debian/Mint
1.`apt-get install fish`
1. Setting Fish as your default shell `chsh -s /usr/bin/fish` logout/login after them

### Extending with _Oh My Fish_

Installation and docs you cann sen at https://github.com/oh-my-fish/oh-my-fish

1. Installation `curl -L https://get.oh-my.fish | fish`
1. Check for updates `omf update`
1. Install specific theme `omf install <THEME>`
1. List themes `omf theme`
1. Create alias 
```
# Define alias in shell
alias rmi "rm -i"

# Define alias in config file
alias rmi="rm -i"

# This is equivalent to entering the following function:
function rmi
    rm -i $argv
end

# Then, to save it across terminal sessions:
funcsave rmi
```    

### Add predefined aliases to your environment

`cp -r .doc/fish-aliases/*.fish ~/.config/fish/functions/`




