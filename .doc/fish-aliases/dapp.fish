# Defined in - @ line 1
function dapp --wraps='docker-compose exec --user 1000:1000 app bash' --description 'alias dapp docker-compose exec --user 1000:1000 app bash'
  docker-compose exec --user 1000:1000 app bash $argv;
end
