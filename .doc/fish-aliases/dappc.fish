# Defined in - @ line 1
function dappc --wraps='docker-compose exec --user 1000:1000 app composer' --description 'alias dappc=docker-compose exec --user 1000:1000 app composer'
  docker-compose exec --user 1000:1000 app composer $argv;
end
