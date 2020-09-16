# Defined in - @ line 0
function dup --description 'alias dup=docker-compose up -d'
	docker-compose up -d $argv;
end
