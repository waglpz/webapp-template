# Defined in - @ line 0
function ddb --description 'alias ddb=docker-compose exec --user 1000:1000 db bash'
	docker-compose exec --user 1000:1000 db bash $argv;
end
